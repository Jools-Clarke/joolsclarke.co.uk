# Checks a built site (default: _site/) for the mistakes that are easy to make
# when adding content. Run via scripts/check.sh, which builds first.
#
# Errors (exit 1):
#   - a link/image/script pointing at a page or file that doesn't exist
#   - links to this site written as https://joolsclarke.co.uk/... (use /path/)
#   - files loaded from raw.githubusercontent.com / github.com/.../raw
#   - images without alt text, pages without a <title>
# Warnings:
#   - pages without a description
#   - a big original image put on a page instead of its small preview
#     (run scripts/thumbnails.sh and use {% include img.html %})

require "uri"

SITE = File.expand_path(ARGV[0] || "_site")
OWN_HOSTS = %w[joolsclarke.co.uk www.joolsclarke.co.uk].freeze
BIG_IMAGE = 500 * 1024
SKIP_PAGES = [%r{^personal/isochrones/}].freeze # generated elsewhere, left as-is

errors = []
warnings = []

def target_file(path)
  file = File.join(SITE, URI.decode_www_form_component(path))
  file = File.join(file, "index.html") if File.directory?(file)
  file
end

Dir.glob("**/*.html", base: SITE).sort.each do |page|
  next if SKIP_PAGES.any? { |re| re.match?(page) }

  html = File.read(File.join(SITE, page), encoding: "UTF-8")
  here = "/#{page}".sub(%r{[^/]*\z}, "")
  redirect = html.include?('http-equiv="refresh"')

  errors << "#{page}: no <title>" unless html =~ %r{<title>\s*\S}
  warnings << "#{page}: no meta description" unless redirect || html.include?('name="description"')

  html.scan(/<(a|img|script|link|source|iframe)\b([^>]*)>/im) do |tag, attrs|
    next if tag == "link" && attrs =~ /rel="(canonical|alternate)"/
    errors << "#{page}: <img> without alt: #{attrs.strip[0, 80]}" if tag == "img" && attrs !~ /\balt=/

    url = attrs[/\b(?:href|src)="([^"]*)"/, 1]
    next if url.nil? || url.empty? || url.start_with?("#", "mailto:", "tel:", "data:", "javascript:")

    if url =~ %r{\A(https?:)?//}
      host = URI.parse(url.start_with?("//") ? "https:#{url}" : url).host rescue nil
      if OWN_HOSTS.include?(host)
        errors << "#{page}: link to the live site #{url} - write it as a site path, e.g. #{URI.parse(url).path}"
      elsif host == "raw.githubusercontent.com" || url =~ %r{github\.com/.*/(raw|blob)/}
        errors << "#{page}: loads #{url} from GitHub - put the file in the repo and link it with a /path/"
      end
      next
    end

    path = url.sub(/[?#].*\z/, "")
    path = File.expand_path(path, here) unless path.start_with?("/")
    file = target_file(path)
    if !File.exist?(file)
      errors << "#{page}: broken link #{url}"
    elsif tag == "img" && File.size(file) > BIG_IMAGE
      warnings << "#{page}: shows the full-size #{path} (#{File.size(file) / 1024} KB) - " \
                  "run scripts/thumbnails.sh and use {% include img.html src=\"#{path}\" %}"
    end
  end
end

warnings.uniq.each { |w| puts "warning: #{w}" }
errors.uniq.each { |e| puts "ERROR:   #{e}" }
puts errors.empty? ? "OK: site check passed (#{warnings.uniq.size} warnings)" : "FAILED: #{errors.uniq.size} problems"
exit(errors.empty? ? 0 : 1)

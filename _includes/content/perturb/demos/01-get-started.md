A small neural network is trained to take apart a noisy signal into the sine waves it is made of. We already know
the right answer (each amplitude lives in its own sine wave), so we can check that Perturb finds what the network is
really looking at.

Perturb needs only three things: the black box as a function (inputs in, answers out), the sample you want explained,
and its noise. Everything else on this page is four steps:

1. **Kernel width:** how far apart two points can be and still move together.
2. **How far to perturb:** how big a nudge the network still handles sensibly.
3. **Perturb:** nudge every region of the sample up and down, and record how the answer moves.
4. **Plot:** turn those responses into maps.

```python
import perturb as pt
from perturb import plotting
```

## The problem

The signal is the sum of 8 sine waves of fixed frequency with unknown amplitudes, plus noise that grows along the
signal. Top: the sample we will explain. Bottom: the same signal taken apart into its sine waves.

![A noisy signal made of 8 sine waves (top), and each sine wave drawn separately at the height of its frequency (bottom)](sample.png){: loading="lazy"}

## The black box

The black box `f` is a 1D convolutional network trained to read the 8 amplitudes off the signal. To Perturb it is just
a function: an array of signals in, an array of amplitudes out. Here it gets most amplitudes about right.

![Left: the signal rebuilt from the network's amplitudes over the noisy sample. Right: true and predicted amplitudes for each frequency](black-box.png){: loading="lazy"}

## Step 1: the width of the kernel

Perturb never moves a single point on its own, because real signals don't jump at one point. It moves a smooth
neighbourhood, as wide as the distance over which real samples rise and fall together. `fit_kernel_width` measures that
from samples drawn from the prior.

```python
fit = pt.fit_kernel_width(X_prior, T, normalise=False)   # X_prior: noiseless samples, T: the x axis
FWHM = fit["fwhm"]
plotting.kernel_fit(fit)
plotting.correlation_matrix(fit)
```

```
kernel FWHM = 0.0642 ± 0.0006 in t (6.4 points)
```

Neighbouring points move together, and stop doing so within about six points. The ripples further out are the sine
waves beating against each other.

![Correlation between pairs of points against their separation, with a Gaussian fitted to the central peak](kernel-fit.png){: loading="lazy"}

![Correlation matrix of every pair of points, strongest along the diagonal](correlation-matrix.png){: loading="lazy"}

## Step 2: how far to perturb

A nudge only tells us something while the network still treats it as a realistic signal. Push too far and it is
answering a question it was never trained on. So first explore a deliberately wide range, then let the network itself
say where it stops responding the way it does to a small nudge.

```python
wide = pt.Perturber(f, T, SIGMA, FWHM)(x_star, pt.magnitude_grid(xi_max=10, n=81))
curve = pt.in_distribution_curve(wide, forward, tol=0.1)   # forward: amplitudes back to a signal
plotting.ood_map(curve, wide)
```

Each column is a nudge centred at one point, each row a size of nudge (in units of the noise, σ). Inside the line
the network responds as it does to small nudges.

![Map of the network's response for every position and nudge size, with a line enclosing the trusted region](in-distribution-map.png){: loading="lazy"}

`max_magnitude` reads off the largest nudge at which nearly every position is still trusted.

```python
XI_MAX = pt.max_magnitude(curve)
plotting.in_distribution(curve)
```

```
in distribution up to |xi| = 3 sigma
```

![Fraction of positions still trusted against nudge size, falling off beyond about 3 sigma](in-distribution-curve.png){: loading="lazy"}

## Step 3: perturb the sample

Now nudge every position, at 101 sizes within that limit, and record how each amplitude moves.

```python
result = pt.Perturber(f, T, SIGMA, FWHM)(x_star, pt.magnitude_grid(xi_max=XI_MAX, n=101))
```

```
response: (100, 101, 8) (centres, magnitudes, outputs);  importance: (100, 8)
```

## Step 4: visualise

**Response-gradient maps.** For one amplitude, purple means raising the signal there raises the amplitude, and orange
means it lowers it. For the lowest frequency the colours follow its sine wave; higher frequencies show the same
pattern, faster.

```python
plotting.gradient_map(result, output=0)
```

![Response-gradient map for the 1 Hz amplitude: one slow band of purple then orange](gradient-map-a1.png){: loading="lazy"}

![Response-gradient map for the 4 Hz amplitude: alternating purple and orange bands](gradient-map-a4.png){: loading="lazy"}

![Response-gradient map for the 8 Hz amplitude: many narrow alternating bands](gradient-map-a8.png){: loading="lazy"}

**Callouts** pick out the most interesting columns automatically: the steepest responses above the map, and the most
curved below it. Each is compared with the straight line the importance alone would predict (dashed). `threshold`
greys out any response bigger than a change you care about, so you can read off how far each region has to move
before the answer changes by that much.

```python
plotting.callouts(result, output=3, n_positive=2, n_negative=2, n_nonlinear=4, threshold=0.1)
```

![Response-gradient map for the 4 Hz amplitude with eight response curves called out above and below it](callouts.png){: loading="lazy"}

The same curves can be drawn on their own:

```python
plotting.response_curves(result, output=7, centres=np.arange(6))
```

![Response curves of the 8 Hz amplitude for nudges at six positions](response-curves.png){: loading="lazy"}

**Importance** sums each map up into one curve per amplitude. Each comes out as its own sine wave (the faint red line
is the true wave, for comparison): the network has learned to read each frequency from where that wave is largest.

```python
plotting.importance(result)
```

![Importance against position for all 8 amplitudes, each closely following its own sine wave](importance.png){: loading="lazy"}

## Using it on your own black box

```python
import perturb as pt
from perturb import plotting

fit = pt.fit_kernel_width(X_prior, x_axis)                                          # 1. kernel width
wide = pt.Perturber(f, x_axis, sigma, fit["fwhm"])(x, pt.magnitude_grid(10, 81))    #    explore
xi_max = pt.max_magnitude(pt.in_distribution_curve(wide, forward, tol=0.1))         # 2. how far
result = pt.Perturber(f, x_axis, sigma, fit["fwhm"])(x, pt.magnitude_grid(xi_max))  # 3. perturb
plotting.gradient_map(result, output=0); plotting.importance(result)                # 4. plot
```

`f` can be anything that maps an array of inputs to an array of outputs: a network, a retrieval, or a wrapper around
external code. If it is random (Monte Carlo dropout, say), fix its randomness between calls, or the maps fill with
noise.

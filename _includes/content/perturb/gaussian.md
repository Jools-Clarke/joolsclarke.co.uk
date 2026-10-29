## Gaussian Perturb

Gaussian perturb is a variant of perturbation feature importance which uses a Gaussian approximation of the feature correlation neighbourhood to minimise spurious samples in perturbation interpretability. This approximation holds for most exoplanet spectra, so in simple terms, Gaussian perturbation is more robust than traditional naive feature importance.

[See it in action: Get started with Perturb ▶︎](/perturb/demos/01-get-started/){: .button}

## FAQs

### What can perturb actually tell me?
At its core, perturb gives you the rate-of-change of response of your black-box to perturbation of individual input features, i.e. if I increase wavelength _x_ what happens to posterior _y_. This is useful for understanding the regions of sensitivity of the black-box for specific parameters, and ultimately can characterise the full black-box response within a certain input distribution. It can tell you which input parameters are most important for the prediction of which output parameters. This can be used to provide increased confidence in the results of black-box retrieval methods, or used as a benchmark for assessing model confidence if used in conjunction with known local feature importance.

As well as just importance, perturbation sensitivity gives us an estimation of how robust to noise this observation is at an input feature level. By backpropagating this information, it can be used to estimate a per-wavelength / per-pixel noise budget for an observation to achieve a desired maximum posterior uncertainty. 

[Noise budgeting and observational planning with Perturb ▶︎](/perturb/demos/02-observations/){: .button}

Importance information can also be used to constrain features which do not contribute to an observation, so that superfluous observational bins can be identified. This can be used in both observation and instrument design. 

[Instrument design with Perturb ▶︎](/perturb/demos/03-instruments/){: .button}

### I want to use my JWST/HST/Ariel data, is this possible?

Perturb is not instrument specific, and can be utilised across a wide range of spectroscopic instruments. Perturb has been verified against HST WFC3 data, JWST NIRSpec data, simulated Ariel data, and a wide range of hypothetical simulated instrument grids. If the instrument does not have a linear wavelength map, i.e. two bins of different widths but a very similar wavelength centre, then perturb can be used, but it will not be able to distinguish between these bins well. If the bins have the _exact_ same wavelength centre, perturb cannot be used as it needs to be able to sort the bins in wavelength order.

### I don't have a CNN retrieval model, why should I care about Perturb?

Perturb is completely black-box agnostic, and can be just as useful for other types of low-latency black-boxes. Perturb can also be used to interpret TauREx and other high-latency traditional retrieval codes, but expect much slower inference speeds and to only be able to achieve lower response resolution.

### Can I use Perturb on non-exoplanet data?

Yes! Perturb can be used on any consecutive or neighbourhood-correlated 1D regression problems. The Gaussian assumption may hold better or worse depending on the nature of your problem, but expect at least some added stability over naive perturbation.

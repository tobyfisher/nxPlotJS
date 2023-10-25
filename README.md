# nxPlotJS

A wrapper for Ploy.ly JS to maintain a consistent display for all charts in OE. **nxPlotJS** manages all aspects of Plot.ly's API apart from the raw data for the plot and some aspects of the layouts. The benefits are"

* Plots are theme coloured (and react to theme changes)
* Summary plots provide a toolbar to change Plot.ly's hovermode
* Summary plots VA Units can be changed without reloading


## Usage

Add **nxPlotJS**
```html
<script defer="" src="**/nxPlot.min.js"></script>
```

For single plot use nxPlotJS will need a `<div>` to load into e.g.
```html
<div id="js-plot-outcomes" class="oeplot-full has-title"></div>
```

Then pass in the required data the Plot requires (this varies slightly depending on the requires of the template, but the approach is the same):
```html
<script>
	document.addEventListener('DOMContentLoaded', () => {
		const outcomes_Errors = nxPlot('outcomes_Errors', "js-plot-outcomes"); // request template and provide div id
		outcomes_Errors.buildLayout(
			// provide layout object 
		);
		outcomes_Errors.buildData(
			// provide Data for plot object
		);
		outcomes_Errors.plotlyReact(); // init Plot.ly
	}, { once: true });
</script>
```

> The above is shown on iDG: [Demo of Glaucoma Outcomes](https://idg.knowego.com/edge/analytics/glaucoma-outcomes/)

---



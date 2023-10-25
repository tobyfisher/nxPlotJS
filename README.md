# nxPlotJS

A wrapper for Ploy.ly JS to maintain a consistent display for all charts in OE. **nxPlotJS** manages all aspects of Plot.ly's API apart from the raw data for the plot and some aspects of the layouts. The benefits:

* Plots are theme coloured (and react to theme changes)
* Summary plots provide a toolbar to change Plot.ly's hovermode
* Summary plots VA Units can be changed without reloading


## Usage

Add **nxPlotJS**
```html
<script defer="" src="**/nxPlot.min.js"></script>
```

### Single plot

A **single plot** will require a `<div>` to load into (which will probably need some CSS classes to handle it's layout on the page)
```html
<div id="js-plot-outcomes" class="oeplot-full has-title"></div>
```

Then pass in the required data for the Plot (this varies slightly depending on the template, but the approach is basically the same):
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

> [Demo on iDG: Glaucoma Outcomes](https://idg.knowego.com/edge/analytics/glaucoma-outcomes/)

---

### Splits plots

Summary (a.k.a OEScape) generally has 2 plots, one for each Eye. These are 2 separate Ploy.ly Plots, but they need the same layouts (and possibly the same horizontal targets lines, Target IOP for example)

The assumption with SplitRL plots is that the correct DOM structure for Summary is available to use:

```html
<div class="oes-right-side"><!-- nxPlotJS hook --></div>
<div class="oes-left-side"><!-- nxPlotJS hook --></div>
```

```html
<script>
	// wait for blueJS to be ready:
	document.addEventListener('DOMContentLoaded', () => {
        
		// note false for div ID as expected DOM should be present
		const splitRL_Glaucoma_selectableVA = nxPlot('splitRL_Glaucoma_selectableVA', false);

		// buildLayout needs to be called before buildData
		splitRL_Glaucoma_selectableVA.buildLayout(
			// provide layout object 
        );

		splitRL_Glaucoma_selectableVA.buildRightData(
			// provide Data for plot object - Right Eye
		);

		splitRL_Glaucoma_selectableVA.buildLeftData(
			// provide Data for plot object - Left Eye
		);

		// horizontals apply to both plots
		splitRL_Glaucoma_selectableVA.addHorizontalLines([ { 'name': 'Target IOP', 'y': 15, 'yaxis': 'y4' } ]);

		// init Plot.ly
		splitRL_Glaucoma_selectableVA.plotlyReact();

	}, { once: true });
</script>
```

> [Demo on iDG: Summary Glaucoma ](https://idg.knowego.com/edge/oes/glaucoma/)

### Horizontal and Vertical marker lines

The above example shows how horizontal lines can be added to a plot, in the case of SplitRL plots only horizontals make sense for both plots, the procedures (vertical line markers) are recorded in the separate right/left data.

```js
// horizontal lines 
addHorizontalLines([ { 'name': 'Target IOP', 'y': 15, 'yaxis': 'y4' } ]);
// vertical lines
addVerticalLines([ { name: 'Over 14 days', x: 14 } ], 1);
```




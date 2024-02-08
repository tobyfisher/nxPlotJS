# nxPlot JS

A wrapper for Ploy.ly JS to maintain a consistent display for all chart plots in OE. **nxPlotJS** manages all aspects of Plot.ly's API apart from the raw data for the plot and some aspects of the layouts. The benefits are:

* Consistent Plot display
* Plots are theme coloured (and react to theme changes)
* Summary plots provide a toolbar to change Plot.ly's hovermode
* Summary plots VA Units can be changed without reloading


## Usage

Load **nxPlot**, _note: requires Plot.ly JS to work_
```html
<script defer src="**/plotly-2.27.0.min.js"></script>
<script defer src="**/nxPlot.min.js"></script>
```
This provides global access to `nxPlot`

### Single plot example

A **single plot** requires a `<div>` to hook into, something like this:
```html
<div id="js-plot-outcomes" class="oeplot-full has-title"></div>
```
After DOMContentLoaded, request a layout template, provide the `div` hook id, pass in layout and data for plotting, then initiate Plot.ly, e.g.
```html
<script>
    document.addEventListener('DOMContentLoaded', () => {
        nxPlot('outcomes_Errors', "js-plot-outcomes")
        .setSelectableUnits() // [optional]
        .buildLayout() // provide layout object 
        .buildData() // provide data for plotting
        .addHorizontalLines() // [optional]
        .addVerticalLines() // [optional]
        .plotlyReact(); // init Plot.ly
}, { once: true });
</script>
```

#### iDG single plot layouts examples:
> [iDG: Bar Chart](https://idg.knowego.com/edge/analytics/search-results-barchart/)

> [iDG: Bar Chart (with vertical)](https://idg.knowego.com/edge/analytics/treatment-targets/)

> [iDG: Eyes Outcomes with Errors](https://idg.knowego.com/edge/analytics/mr-outcomes/)
 
> [iDG: Outcomes with Errors](https://idg.knowego.com/edge/analytics/glaucoma-outcomes/)

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




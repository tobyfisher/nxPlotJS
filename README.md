# nxPlot JS

A wrapper for Ploy.ly JS to maintain a consistent display for all chart plots in OE. **nxPlot JS** manages all aspects of Plot.ly's API separated from the raw data for plotting of the charts and some aspects of the layouts. The benefits are:

* Consistent Plot display
* Plots are theme coloured (and react to theme changes)
* Summary plots provide a toolbar to change Plot.ly's hovermode
* Summary plots VA Units can be changed without reloading
* Summary plots allow marker hovermode to be changed (via toolbar)

## Usage

Load **nxPlot**, _obviously requires Plot.ly JS to work_
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
> [iDG: Outcomes with Errors](https://idg.knowego.com/edge/analytics/glaucoma-outcomes/)

> [iDG: Bar Chart](https://idg.knowego.com/edge/analytics/search-results-barchart/)

> [iDG: Bar Chart (with vertical)](https://idg.knowego.com/edge/analytics/treatment-targets/)

> [iDG: Eyes Outcomes with Errors](https://idg.knowego.com/edge/analytics/mr-outcomes/)

> [iDG: Summary eyes: BEO, Right & Left](https://idg.knowego.com/edge/oes/beo-demo/)
---

### Splits plots (in Summary)

Two unique plots, one for each eye. These are two separate Ploy.ly Plots, but using the same layouts (and possibly the same horizontal targets lines; target IOP for example)

The correct DOM structure for Summary must be available:

```html
<div class="oe-full-content oes-v2 oeplot use-full-screen">
    <div class="oes-right-side"><!-- nxPlotJS hook --></div>
    <div class="oes-left-side"><!-- nxPlotJS hook --></div>
</div>
```
### Split plot example

```html
<script>
    document.addEventListener('DOMContentLoaded', () => { 
        // 'false' for div ID as expected DOM should be present
        nxPlot('splitRL_Glaucoma_selectableVA', false)
        .setSelectableUnits() // if there are selectable VA units
        .buildLayout() // provide layout object
        .buildRightData()// provide data for Right Eye
        .buildLeftData() // provide data for Left Eye
        .addHorizontalLines() // [optional]
        .addVerticalLines() // [optional]
        .plotlyReact();
    }, { once: true });
</script>
```

> [iDG: SplitPlot for Glaucoma with selectable VA Units](https://idg.knowego.com/edge/oes/glaucoma/)

> [iDG: SplitPlot for Adherence](https://idg.knowego.com/edge/oes/adherence/)

> [iDG: SplitPlot for MR with selectable VA units](https://idg.knowego.com/edge/oes/medical-retina/)


### Adding Horizontal &amp; Vertical plot lines

Horizontal & verical lines can be added to a plot, but in the case of SplitPlots only horizontals can be used, use 'procedures' for vertical line markers in the separate right/left data.

#### Examples; both except an Array

```js
.addHorizontalLines([ { 'name': 'Target IOP', 'y': 15, 'yaxis': 'y4' } ]);
.addVerticalLines([ { name: 'Over 14 days', x: 14 } ], 1);
```

## Custom Events

When the User changes theme broadcast the following custom event:
`oeThemeChange` e.g. as on iDG:

```js
// nxPlotJS is listening for this
const event = new CustomEvent("oeThemeChange", { detail: theme });
setTimeout(() => {
	// give the browser time to re-adjust and render CSS changes
	document.dispatchEvent(event);
}, 50);
```






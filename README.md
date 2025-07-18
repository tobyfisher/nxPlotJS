# nxPlot JS

Wrapper for Ploy.ly JS to provide a consistent UIX for all chart plots shown in OE. **nxPlot JS** manages Plot.ly's API separated from the data required to plot of the charts. The benefits of this approach:

* Consistent Plot UIX
* Plots are theme coloured (and react to theme changes)
* Summary plots provide a toolbar to change Plot.ly's 'hovermode'
* Summary plots VA Units can be changed without reloading the data
* Abstraction: this approach in theory allows plot.ly JS to be replaced with another library

## Usage

`<head>` JS script loads **nxPlot**, _obviously requires Plot.ly JS first to work_
```html
<script defer src="**/plotly-2.27.0.min.js"></script>
<script defer src="**/nxPlot.min.js"></script>
```
After `DOMContentLoaded` global access is available to `nxPlot`

### Single plot example

A **single plot** requires a `<div>` to hook into, something like this:
```html
<div id="js-plot-outcomes" class="oeplot-full has-title"></div>
```
After DOMContentLoaded, request a layout template, provide the `div` hook id, pass in layout and data for plotting, then initiate Plot.ly, e.g.
```html
<script>
    document.addEventListener('DOMContentLoaded', () => {
        nxPlot('outcomes_Errors', "js-plot-outcomes") // layout, div id
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

Two plots, one for each eye: two separate Ploy.ly Plots, but both using the same layout (and possibly the same horizontal targets lines e.g. target IOP)

The correct DOM structure for Summary is expected and **must** be available:

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
        nxPlot('splitRL_Glaucoma_vaChangeableUnits', false)
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

#### Examples; both expect an Array

```js
.addHorizontalLines([ { 'name': 'Target IOP', 'y': 15, 'yaxis': 'y4' } ])
.addVerticalLines([ { name: 'Over 14 days', x: 14 } ], 1)
```

### Layout only (custom Traces)

If custom traces are required you can use the layout and pass in your own trace array (as per plot.ly API), for example:

```js
/** nxPlot */
nxPlot('customData', graph.id)
  .buildLayout({ 
      xaxis: { title: 'Age (Yrs)' },
      yaxis: { y1: { title: 'Mean Deviation (dB)' } }
  })
  .buildData( customTracesArray )
  .plotlyReact();
```
> [iDG: customData example](https://idg.knowego.com/edge/analytics/glaucoma-visual-field-progression/)

### Handling CF, HM, PL, NPL
The `base_value` for these are respectively `1,2,3,4`. However, some consideration will need to be given to what values are used in respect to the choosen VA scale. e.g. for logMAR, iDG has them set for 1.4, 1.6, 1.8 and 2:
```js
customTicks: {
    vals: [-0.2, 0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2],
    text: [-0.2, 0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, "CF", "HM", "LP", "NLP"],
    reverseRange: true
}
```

## Theme change

When the User changes theme broadcast the following custom event:
`oeThemeChange` e.g. as per iDG:

```js
// nxPlotJS is listening for this
const event = new CustomEvent("oeThemeChange", { detail: theme });
setTimeout(() => {
	// give the browser time to re-adjust and render CSS changes
	document.dispatchEvent(event);
}, 50);
```






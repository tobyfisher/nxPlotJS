import * as utils from "utils";

/**
 * Summary Toolbar
 * Allow Users to switch easy between VA scales (for example)
 * And expose some of Plotly API,
 */
export const toolBar = {
	plot: null,
	hoverMode: 'closest', // but shown as 'Single'
	selectedUnit: "",

	/**
	 * Setup - hard link with the current layout object
 	 * @param plot {Object} - pass in current layout object
	 */
	linkToPlot( plot ){
		// hard link to plot facade to be able to call the rebuild on changes
		this.plot = plot;
		this.toolBarDiv = utils.buildDiv('oeplot-toolbar');
		this.demoTabularDataBtn();
		this.appendToolbarDiv();

		/**
		 * Listen for any changes in the toolbar select options
		 */
		this.toolBarDiv.addEventListener('change', ( { target } ) => {
			if( target.name === "hover"){
				this.hoverMode = target.options[target.selectedIndex].value
				this.plot.layout.hoverMode = this.hoverMode;
				this.plot.plotlyReact();
			}
			if( target.name === "selectable"){
				this.selectedUnit = target.options[target.selectedIndex].value;
				this.plot.plotlyReact();
			}
		}, { capture: true });
	},

	appendToolbarDiv(){
		const wrapper = document.querySelector('.oeplot');
		wrapper.classList.add('with-toolbar');
		wrapper.append( this.toolBarDiv );
	},

	demoTabularDataBtn(){
		// add tabular button to the toolbar
		const tabularBtn = utils.buildElem('button', false, "View as tabular data");
		tabularBtn.onclick = function(){
			alert("Show a tabular version of all the plot data in an overlay popup (no iDG demo of this as yet)");
		}
		this.toolBarDiv.append(tabularBtn);
	},


	/**
	 * Expose the plotly API for 'hovermode' options as dropdown
	 * [key, name] - key is what Plotly API uses.
	 */
	allowUserToChangeHoverMode(){
		this.buildDropDown("hover",[
			['closest','Single'], // default "closest"
			['x','Closest'],
			['x unified','Grouped']
		], 'Show plot labels as:');
	},

	/**
	 * Build dropdown, first one is default
	 * @param selectableUnitRanges {Object}
	 */
	allUserToSelectUnits( selectableUnitRanges, label ){
		const opts = [];
		// set up all the available options for selectable VA units
		for ( const yUnit in selectableUnitRanges ){
			const yAxis = selectableUnitRanges[yUnit];
			opts.push([yUnit, yAxis.name]);
			toolBar.selectedUnit = toolBar.selectedUnit || yUnit ;
		}

		this.buildDropDown("selectable", opts, label);
	},

	/**
	 * @param name {String}
	 * @param options {Array>}
	 */
	buildDropDown( name, options, label ){
		// build dropdown
		const selectOptions = options.map(opt => `<option value="${opt[0]}">${opt[1]}</option>`);

		const div = utils.buildDiv('plot-tool');
		div.innerHTML = [
			`<label>${label}</label>`,
			`<select name="${name}">`,
			selectOptions.join(''),
			'</select>'
		].join('');

		// add to the toolbar
		this.toolBarDiv.prepend(div);
	}
};

	
		

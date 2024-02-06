import * as utils from "utils";
import * as debug from "debug";

/**
 * Summary Toolbar
 * Allow Users to switch easy between VA scales (for example)
 * And expose some of Plotly API,
 */
export const toolBar = {
	plot: null,
	hoverMode: 'closest', // but shown as 'Single'
	selectable: {
		units: new Map(),
		key: false
	},

	/**
	 * Setup - hard link with the current layout object
	 * @param plot {Object} - pass in current layout object
	 */
	linkToPlot( plot ){
		// hard link to plot facade to be able to call the rebuild on changes
		this.plot = plot;
		this.toolBarDiv = utils.buildDiv('oeplot-toolbar');
		this.appendToolbarDiv();

		/**
		 * Listen for any changes in the toolbar select options
		 */
		this.toolBarDiv.addEventListener('change', ( { target } ) => {
			if ( target.name === "hoverMode" ){
				this.hoverMode = target.options[target.selectedIndex].value
				this.plot.plotlyThemeChange(); // need to run the rebuild through this
			}
			if ( target.name === "selectableUnits" ){
				this.selectableKey = target.options[target.selectedIndex].value;
				this.plot.plotlyThemeChange(); // need to run the rebuild through this
			}
		}, { capture: true });
	},

	appendToolbarDiv(){
		const wrapper = document.querySelector('.oeplot');
		if ( wrapper === null ){
			debug.error(`toolBar requires a div.oeplot`);
			return;
		}
		wrapper.classList.add('with-toolbar');
		wrapper.append(this.toolBarDiv);
	},

	/**
	 * Expose the plotly API for 'hovermode' options as dropdown
	 * [key, name] - key is what Plotly API uses.
	 */
	allowUserToChangeHoverMode(){
		this.buildDropDown("hoverMode", 'Show labels as:', [
			[ 'Single', 'closest' ],
			[ 'Closest', 'x' ],
			[ 'Grouped', 'x unified' ]
		]);
	},

	/**
	 * Selectable units
	 * @param selectableUnits {Object}
	 * @param label {String}
	 */
	allowUserToSelectUnits: function ( selectableUnits ){
		if ( this.selectable.key !== false ) return; // only need to set this up
		this.selectable.units = selectableUnits;
		this.selectable.key = Object.keys(selectableUnits).at(0); // set it to the first key in the list

		const selectOptions = Object.entries(selectableUnits).map(
			( [ key, value ] ) => ({ value: key, text: value.name })
		);

		this.buildDropDown("selectableUnits", 'Select VA Units', selectOptions);
	},

	getSelectedUnit(){
		return this.selectable.key;
	},

	buildDropDown( selectName, labelText, selectOptions ){
		// build dropdown
		const div = utils.buildDiv('plot-tool');
		const label = utils.buildElem('label', false, labelText);
		const select = utils.buildElem('select');

		select.name = selectName;

		for ( const opt of selectOptions ){
			const newOpt = document.createElement("option");
			newOpt.value = opt.value;
			newOpt.text = opt.text;
			select.add(newOpt);
		}

		// update DOM
		div.append(label, select);
		this.toolBarDiv.prepend(div);
	}
};

	
		

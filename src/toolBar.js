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
	selectableUnits: new Map(),
	selectableKey: "",

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
		if( wrapper === null ){
			debug.error(`toolBar requires a div.oeplot`);
			return;
		}
		wrapper.classList.add('with-toolbar');
		wrapper.append(this.toolBarDiv);
	},

	demoTabularDataBtn(){
		// add tabular button to the toolbar
		const tabularBtn = utils.buildElem('button', false, "View as tabular data");
		tabularBtn.onclick = function (){
			alert("Show a tabular version of all the plot data in an overlay popup (no iDG demo of this as yet)");
		}
		this.toolBarDiv.append(tabularBtn);
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
	allowUserToSelectUnits: function ( selectableUnits, label ){
		const options = [];
		for ( const [ key, value ] of Object.entries(selectableUnits) ){
			// build UI select options
			options.push([ value.name, key ]);
			// store options in Map
			this.selectableUnits.set( key, value );
			// key must be identical to the 'key' in the data traces
			this.selectableKey = this.selectableKey || key;
		}
		this.buildDropDown("selectableUnits", label, options);
	},

	getSelectedUnit(){
		return this.selectableUnits.get( this.selectableKey );
	},

	buildDropDown( name, label, options ){
		// build dropdown
		const div = utils.buildDiv('plot-tool');
		const $label = utils.buildElem('label', false, `${label}`);
		const $select = utils.buildElem('select');
		$select.name = name;

		for( const opt of options ){
			const newOpt = document.createElement("option");
			newOpt.value = opt[1];
			newOpt.text = opt[0];
			$select.add( newOpt );
		}

		div.append( $label, $select );

		// add to the toolbar
		this.toolBarDiv.prepend(div);
	}
};

	
		

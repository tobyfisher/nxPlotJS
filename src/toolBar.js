import * as utils from "utils";
import * as debug from "debug";

/**
 * Toolbar (for Summary pages)
 * Allow Users to switch easy between VA scales (for example)
 * And expose some of Plotly API,
 */
export const toolBar = {
	layout: null,
	div: null,
	userSelected: {
		hoverMode: 'closest',  // default, but shown as 'Single' as this makes sense?
		vaUnits: ''
	},
	selectableUnits: false,

	/**
	 * Setup - hard link with the current layout object
	 * @param layout {Object} - pass in current layout object
	 */
	linkToLayout( linkedLayout ){
		this.layout = linkedLayout;
		this.buildDOM();
		return this;
	},

	/**
	 * toolBar is only for Summary pages
	 * it requires that DOM structure (currently)
	 */
	buildDOM(){
		const wrapper = document.querySelector('.oeplot');
		if ( wrapper === null ){
			debug.error(`toolBar is only for Summary pages, it requires the div.oeplot structure`);
		}

		this.div = utils.buildDiv('oeplot-toolbar');
		wrapper.append(this.div);
		wrapper.classList.add('with-toolbar');
	},

	userChangesSomething( what, newVal ){
		switch( what ){
			case "plotPointsHoverMode": this.userSelected.hoverMode = newVal;
			break;
			case "vaUnits": this.userSelected.vaUnits = newVal;
			break;
			default: return;
		}
		this.layout.rebuild();
	},

	/**
	 * Expose the plotly API for 'hovermode' options as dropdown
	 * [key, name] - key is what Plotly API uses.
	 */
	allowUserToChangeHoverMode(){
		this.buildDropDown(
			'plotPointsHoverMode',
			'Plots hover info show:',
			[
				{ text: 'Single', value: this.hoverMode }, // default
				{ text: 'Closest', value: 'x' },
				{ text: 'Grouped', value: 'x unified' }
			]);
	},

	getHoverMode(){
		return this.userSelected.hoverMode;
	},

	/**
	 * Selectable units (VA only for now)
	 * @param selectableUnits {Object}
	 * @param label {String}
	 */
	allowUserToSelectUnits: function ( selectableUnits ){
		this.userSelected.vaUnits = Object.keys(selectableUnits).at(0); // set it to the first key in the list
		this.selectableUnits = selectableUnits;

		const selectOptions = Object.entries(selectableUnits).map(
			( [ key, value ] ) => ({ value: key, text: value.name })
		);

		this.buildDropDown(
			'vaUnits',
			'Select VA Units',
			selectOptions
		);
	},

	getSelectedUnit(){
		return this.userSelected.vaUnits;
	},

	getSelectedUnitNameRange(){
		return this.selectableUnits[ this.getSelectedUnit() ];
	},

	buildDropDown( userSelects, labelText, selectOptions ){
		const select = utils.buildElem('select');

		for ( const opt of selectOptions ){
			const newOpt = document.createElement("option");
			newOpt.value = opt.value;
			newOpt.text = opt.text;
			select.add(newOpt);
		}

		// update DOM
		const div = utils.buildDiv('plot-tool');
		div.append(
			utils.buildElem('label', false, labelText),
			select
		);
		this.div.append(div);

		/**
		 * Listen for any changes in the toolbar select options
		 */
		select.addEventListener('change', ( { target } ) => {
			this.userChangesSomething(userSelects, target.options[target.selectedIndex].value);
		});
	}
};

	
		

import * as utils from "./utils";
import * as debug from "./debug";

/**
 * Toolbar (for Summary pages)
 * Allow Users to switch easy between VA scales (for example)
 * And expose some of Plotly API,
 */
export const toolBar = {
	layout: null,
	div: null,
	hoverMode: 'closest',  // default, but shown as 'Single' as this makes sense?
	currentVA: 'currentVA',
	eNum: {
		VAUnitRequest: "VAUnitChange",
		plotHoverMode: "PlotHoverMode"
	},

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
			case this.eNum.plotHoverMode:
				this.hoverMode = newVal;
				debug.log(`change hovermode to "${newVal}"`);
				this.layout.relayout();
			break;
			case this.eNum.VAUnitRequest:
				if( newVal !== this.currentVA){
					debug.log(`User requests VA Units change: "${newVal}"`);
				}
			break;
			default: return;
		}
	},

	/**
	 * Expose the plotly API for 'hovermode' options as dropdown
	 * [key, name] - key is what Plotly API uses.
	 */
	allowUserToChangeHoverMode(){
		this.buildDropDown(
			this.eNum.plotHoverMode,
			'Plots hover info show:',
			[
				{ text: 'Single', value: this.hoverMode }, // default
				{ text: 'Closest', value: 'x' },
				{ text: 'Grouped', value: 'x unified' }
			]);
	},

	getHoverMode(){
		return this.hoverMode;
	},

	/**
	 * Selectable units (VA)
	 * @param current {String}
	 * @param available {Array}
	 */
	allowUserToSelectUnits: function ( current, available ){

		const selectOptions = [ { text: current, value: this.currentVA } ];

		available.forEach(  opt => {
			selectOptions.push( opt )
		});

		this.buildDropDown(
			this.eNum.VAUnitRequest,
			'Change VA Units',
			selectOptions
		);
	},

	buildDropDown( userSelects, labelText, selectOptions ){
		const
			label = utils.buildElem('label', false, labelText),
			select = utils.buildElem('select'),
			id = `toolBar-${userSelects}`;

		select.id = id;
		label.setAttribute('for', id);

		for ( const opt of selectOptions ){
			const newOpt = document.createElement("option");
			newOpt.value = opt.value;
			newOpt.text = opt.text;
			select.add(newOpt);
		}

		// update DOM
		const div = utils.buildDiv('plot-tool');
		div.append(
			label,
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

	
		

import * as utils from "../utils";
import * as debug from "../debug";

/**
 * Manage changing the UI for split view layouts
 * - .oe-full-header - #js-nxplot-manage-layout
 * if the DOM exists, then set it up...
 */

export const setupSplitLayoutView = ( nxLayout ) => {
	const div = document.getElementById( splitLayoutView.id );
	if( div !== null ) {
		splitLayoutView.init( nxLayout, div );
	}
}

export const splitLayoutView =  {
	id:'js-nxplot-manage-layout',
	layoutIcon: null,
	nxPlotLayout: false,
	splitIcons: [ '1-0', '2-1', '1-1', '1-2', '0-1' ],
	currentSplit: 'split-1-1',

	init( splitCore, div ){

		this.nxPlotLayout = splitCore;

		// build split layout options
		const splitOptBtns = this.buildSplitBtns( div );

		// btns
		const
			rightBtn = document.getElementById( 'js-nx-right' ),
			leftBtn = document.getElementById( 'js-nx-left'),
			layoutBtn = document.getElementById( 'js-nx-layout' );

		// need to update the icon to show the current Split format
		this.layoutIcon = layoutBtn.querySelector( 'i' );

		if( rightBtn === null || leftBtn === null || layoutBtn === null ){
			debug.error('Missing some btns in splitLayoutView?');
			return false;
		}

		rightBtn.addEventListener('pointerdown', () => {
			this.changeLayout('full-right');
		});

		leftBtn.addEventListener('pointerdown', () => {
			this.changeLayout('full-left');
		});

		layoutBtn.addEventListener('pointerdown', () => {
			this.changeLayout(this.currentSplit);
		});

		layoutBtn.addEventListener('pointerenter', () => {
			splitOptBtns.classList.remove('hidden');
		});

		div.addEventListener('pointerleave', () => {
			splitOptBtns.classList.add('hidden');
		});
	},

	changeLayout( gridLayout ){
		const splitGrid = document.querySelector( '.oes-v2 .oes-split-grid' );

		if( splitGrid === null ){
			debug.error('Cannot find div.oes-split-grid');
			return false;
		}

		// reset CSS classes
		const splitClasses = this.splitIcons.map(icon => `split-${icon}`);
		splitGrid.classList.remove('full-right','full-left', ...splitClasses);

		// new layout for grid
		splitGrid.classList.add( gridLayout );

		/// only need track the split formatting
		if( gridLayout.startsWith('split-') ){
			this.currentSplit = gridLayout;
			// update the layout button to match
			this.layoutIcon.className = `oes-layout-icon i-${this.currentSplit.substring(6)}`;
		}

		// plotJS needs to relayout it's plots
		this.nxPlotLayout.relayoutPlots();
	},

	buildSplitBtns( div ){
		const layoutOpts = utils.buildDiv('split-layout-options');
		const optionBtns = this.splitIcons.map(icon => {
			return `<div class="split-option-btn" data-layout="split-${icon}"><i class="oes-layout-icon i-${icon}"></i></div>`;
		});
		layoutOpts.innerHTML = optionBtns.join('');
		layoutOpts.classList.add('hidden');

		layoutOpts.addEventListener('pointerdown', ({ target }) => {
			this.changeLayout(target.dataset.layout);
		});

		div.append(layoutOpts);
		return layoutOpts;
	},
};
import * as utils from "../utils";
import * as debug from "../debug";

/**
 * Manage the UI view layouts for OEScape
 */

export const splitLayoutView = {
	nxPlotLayout: false,
	dom: {
		manageLayout: 'js-nxplot-manage-layout',
		splitGrid: '.oes-split-grid',
		rightEye: {},
		leftEye: {}
	},
	btns: {
		right: "right",
		left: "left",
		both: "both",
		layout: "layout",
	},
	viewBtns: {},
	modeBtn: null,
	cssPrefix: 'split-',
	splitFormat: [ '1-0', '2-1', '1-1', '1-2', '0-1' ],
	layoutSplit: "1-1",
	layoutIcon: null,
	debounceTimer: null,

	init( splitCore ){

		this.nxPlotLayout = splitCore;

		const div = document.getElementById(this.dom.manageLayout);

		// classes on splitGrid adjust the layout
		this.splitClasses = this.splitFormat.map(layout => `${this.cssPrefix + layout}`);
		this.dom.splitGrid = document.querySelector(this.dom.splitGrid);

		if ( div === null || this.dom.splitGrid === null ){
			debug.error('splitLayoutView: missing key DOM');
			return false;
		}

		// plots and reports
		for( const side of ['right', 'left']){
			this.dom[`${side}Eye`].plot = this.dom.splitGrid.querySelector(`.${side}-eye-plot`);
			this.dom[`${side}Eye`].reports = this.dom.splitGrid.querySelector(`.reports-${side}-eye`);
		}

		// find and setup btns
		for ( const btn in this.btns ){
			const viewBtn = document.getElementById(`js-nx-${btn}`);
			if ( !viewBtn ) debug.error('splitLayoutView: missing btn');

			viewBtn.dataset.mode = btn;

			// default view is "both" plots
			if ( btn === this.btns.both ){
				viewBtn.classList.add('selected');
				this.modeBtn = viewBtn;
			}

			this.viewBtns[btn] = viewBtn;
		}

		// need to update the icon to show the current Split format
		this.layoutIcon = this.viewBtns.layout.querySelector('i');

		// build split layout options
		const splitLayoutBtns = this.buildSplitLayoutOptions(div);

		this.viewBtns.layout.addEventListener('pointerenter', () => {
			splitLayoutBtns.classList.remove('hidden');
		}, { passive: true });

		div.addEventListener('pointerleave', () => {
			splitLayoutBtns.classList.add('hidden');
		}, { passive: true });

		div.addEventListener('pointerdown', ( { target } ) => {
			this.changeViewMode(target);
		});

		document.addEventListener( "nxPlotReportDate", ( e )=>{
			const { date, eye } = e.detail;
			const plotSide = eye === "R" ? "right" : "left";
			this.changeViewMode( this.viewBtns[plotSide] );
		});
	},

	/**
	 * 'R' or 'L' for "report" mode: (graph|reports or reports|graph)
	 * 'Graph' icon for "graph" mode, bot will reset to 1-1 split
	 * 'full-right' and 'full-left' layouts are available but currently unused
	 */
	changeViewMode( btn ){

		if ( btn.classList.contains('split-option-btn') ){
			// split layout format option
			this.changeLayout(btn.dataset.layout);
		} else {
			// or, it's view mode change
			const mode = btn.dataset.mode;

			if ( mode === this.btns.layout ){
				// reset to 1-1 layout
				if ( this.layoutSplit !== '1-1' ){
					this.changeLayout();
				}
			} else {
				if ( btn === this.modeBtn ) return;
				this.modeBtn = btn;

				// update selected css
				for ( const b of Object.values(this.viewBtns) ){
					b.classList.toggle('selected', b === btn);
				}

				this.changeLayout();

                const { rightEye, leftEye } = this.dom;

                // Show/hide plots
                rightEye.plot.hidden = (mode === this.btns.left);
                leftEye.plot.hidden  = (mode === this.btns.right);

                // Show reports only for the selected single-eye modes
                rightEye.reports.hidden = (mode !== this.btns.right);
                leftEye.reports.hidden  = (mode !== this.btns.left);
            }
		}
	},

	/**
	 * note: 'full-right' and 'full-left' layouts are available in nxblu but are currently unused
	 */
	changeLayout( newLayoutSplit = '1-1' ){
		// reset CSS classes
		this.dom.splitGrid.classList.remove(...this.splitClasses);
		this.dom.splitGrid.classList.add(`${this.cssPrefix + newLayoutSplit}`);

		// update the layout button to show the current layout
		this.layoutIcon.className = `oes-layout-icon i-${newLayoutSplit}`;
		this.layoutSplit = newLayoutSplit;

		// plotJS needs to relayout it's plots to fit the new DOM
		this.debounceLayout();
	},

	debounceLayout(){
		if ( this.debounceTimer ) window.cancelAnimationFrame(this.debounceTimer);
		this.debounceTimer = window.requestAnimationFrame(() => {
			this.debounceTimer = null;
			this.nxPlotLayout.relayout();
		});
	},

	buildSplitLayoutOptions( div ){
		const layoutOpts = utils.buildDiv('split-layout-options');
		const optionBtns = this.splitFormat.map(icon => {
			return `<div class="split-option-btn" data-layout="${icon}"><i class="oes-layout-icon i-${icon}"></i></div>`;
		});
		layoutOpts.innerHTML = optionBtns.join('');
		layoutOpts.classList.add('hidden');

		div.append(layoutOpts);
		return layoutOpts;
	},
};
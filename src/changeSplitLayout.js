import * as debug from "debug";
import * as utils from "utils";

export const changeSplitLayout = {
	once: false,
	layoutBtn: null,
	layoutBtnIcon: null,
	layoutOpts: null,
	oesSide: {},

	init( splitCore ){
		if ( this.once ) return;
		this.once = true;

		const layoutSelectBtn = document.querySelector('.layout-select-btn');
		if ( layoutSelectBtn === null ||
			layoutSelectBtn.classList.contains('not-allowed') ) return; // change layout not allowed ( e.g showing OCT image in other panel?)

		// build DOM
		const div = layoutSelectBtn.parentElement;
		const layoutOpts  = this.buildLayoutOpts( div );

		// set up Events
		div.addEventListener('mouseleave', () => this.hide());
		layoutSelectBtn.addEventListener('mouseenter', () => this.show());
		layoutOpts.addEventListener('pointerdown', ({ target }) => {
			this.onChangeLayout(target.dataset.layout);
			splitCore.relayoutPlots(); // call once...
			setTimeout(()=>{
				splitCore.relayoutPlots(); // ...then call again - this seems to fix a slight re-draw error!
			}, 50);
		});

		this.layoutBtn = layoutSelectBtn;
		this.layoutBtnIcon = layoutSelectBtn.querySelector('.oes-layout-icon');
		this.layoutOpts = layoutOpts;
		this.oesSide.right =  document.querySelector('.oes-right-side');
		this.oesSide.left =  document.querySelector('.oes-left-side');
	},

	show(){
		this.layoutOpts.classList.remove('hidden');
		this.layoutBtn.classList.add('active');
	},

	hide(){
		this.layoutOpts.classList.add('hidden');
		this.layoutBtn.classList.remove('active');
	},
	
	buildLayoutOpts( div ){
		const layoutOpts = utils.buildDiv('layout-options');
		const optionBtns = [ '1-0', '2-1', '1-1', '1-2', '0-1' ].map(icon => {
			return `<div class="layout-option-btn" data-layout="${icon}"><i class="oes-layout-icon i-${icon}"></i></div>`;
		});
		layoutOpts.innerHTML = optionBtns.join('');
		layoutOpts.classList.add('hidden');
		div.append(layoutOpts);
		return layoutOpts;
	},

	onChangeLayout( layout ){
		// layout options: ['1-0', '2-1', '1-1', '1-2', '0-1']
		const
			left = this.oesSide.left,
			right = this.oesSide.right;

		if( left === null || right === null ) console.error('nxPlot: DOM sides null?')

		// default is 1-1
		left.classList.remove('fill-2', 'fill-3');
		right.classList.remove('fill-2', 'fill-3');

		switch ( layout ){
			case '1-0':
				right.classList.add('fill-3');
				break;
			case '2-1':
				right.classList.add('fill-2');
				break;
			case '0-1':
				left.classList.add('fill-3');
				break;
			case '1-2':
				left.classList.add('fill-2');
				break;
			case '1-1':
				// default
				break;

			default:
				debug.error('oesChangeSidesLayout', `Unknown layout request ${layout}`);
				return false;
		}

		// update the layout button
		this.layoutBtnIcon.className = `oes-layout-icon i-${layout}`;
	}
};
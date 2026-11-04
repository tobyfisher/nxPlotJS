import * as debug from "../../debug";
import { isoDateToHuman } from "../../utils";
import { customEvent } from "../../core/customEvents";

debug.listModule("oescapeReports");

/**
 * For Right and Left side
 */
const Reports = {
	currentReportIndex: -1,
	side: "",
	container: null,
	grid: null,
	title: null,
	view: {
		report: null,
		img: null
	},
	css: {
		selected: "selected",
		showAll: "show-all",
	},
	reports: [],

	init(){
		const div = document.querySelector(`.reports-${this.side}-eye`)
		this.container = div;
		this.title = div.querySelector(".report-title");
		this.view.report = div.querySelector(".oes-view-report");
		const img = new Image();
		const fullReportImg = this.view.report.querySelector(".full-report-img");
		fullReportImg.appendChild(img);
		this.view.img = img;

		this.reports = Array.from(this.grid.children).filter(( el, index ) => {
			if ( el.classList.contains('date-report') ){
				el.dataset.index = index.toString();
				return el;
			}
		});

		this.grid.addEventListener("pointerdown", ( { target } ) => {
			if ( target.classList.contains('date-report') ){
				this.viewReport(target, target.dataset);
			}
		});

		const
			btnPrev = div.querySelector(".btn-prev-report"),
			btnNext = div.querySelector(".btn-next-report"),
			btnAll = div.querySelector(".btn-all-reports");

		btnPrev.addEventListener("click", () => this.prevReport());
		btnNext.addEventListener("click", () => this.nextReport());
		btnAll.addEventListener("click", () => this.allReports());

		document.addEventListener("keydown", (e) => {
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				this.prevReport();
			}

			if (e.key === 'ArrowRight') {
				e.preventDefault();
				this.nextReport();
			}
		});

		this.title.textContent = `All (${this.reports.length})`;

		document.addEventListener( "nxPlotReportDate", ( e )=>{
			const { date, eye } = e.detail;
			const plotSide = eye === "R" ? "right" : "left";
			if( plotSide !== this.side ) return;

 			const matchIndex = this.reports.findIndex( report => report.dataset.reportDate === date );
			const report = this.reports[matchIndex];

			this.viewReport( report, report.dataset );
		});
	},

	viewReport( dateReport, { index, reportDate } ){
		this.grid.classList.remove(this.css.showAll);

		let reportCount = 0;
		this.reports.forEach(report => {
			report.classList.remove(this.css.selected);
			if ( report.dataset.reportDate === reportDate ){
				report.hidden = false;
				reportCount++;
			} else {
				report.hidden = true;
			}
		});

		dateReport.classList.add(this.css.selected);
		this.title.textContent = `${isoDateToHuman(dateReport.dataset.reportDate)} (${reportCount})`;
		this.currentReportIndex = Number(index); // string in DOM

		const img = dateReport.querySelector("img");
		this.view.report.hidden = false;
		this.view.img.src = img.src;

		customEvent('oesReportDate', { date: reportDate, side: this.side });
	},

	allReports(){
		this.view.report.hidden = true;
		this.grid.classList.add(this.css.showAll);
		this.reports.forEach(report => {
			report.classList.remove(this.css.selected);
			report.hidden = false;
		});

		this.title.textContent = `All (${this.reports.length})`;
		this.currentReportIndex = -1;

		customEvent('oesReportDate', { date: false, side: this.side });
	},

	nextReport(){
		this.loopReports(this.currentReportIndex + 1);
	},

	prevReport(){
		const prevPos = this.currentReportIndex === -1
			? this.reports.length - 1
			: this.currentReportIndex - 1;
		this.loopReports(prevPos);
	},

	loopReports( reportIndex){
		const len = this.reports.length;
		const idx = ((reportIndex % len) + len) % len; // safe modulo for negatives
		const report = this.reports[idx];
		this.viewReport(report, report.dataset);
	}
};

/**
 * set up for both sides
 */


(function setupReports(){
	const reportGrids = Array.from(document.body.querySelectorAll(".oes-report-grid"));
	if ( reportGrids.length === 0 ) return;

	reportGrids.forEach(( reportGrid ) => {
		const reports = Object.assign({}, Reports); // composition
		reports.side = reportGrid.dataset.side;
		reports.grid = reportGrid;
		reports.init();
	});
})();
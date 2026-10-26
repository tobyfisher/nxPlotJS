import { isDarkTheme } from "./helpers/isDarkTheme";

export const fontWeight = ( str = "normal") => {
	if( str === "light"){
		return isDarkTheme() ? '300' : '400';
	}
	return isDarkTheme() ? '400' : '600';
}
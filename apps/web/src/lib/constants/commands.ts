import SolarPenNewSquareBoldDuotone from '~icons/solar/pen-new-square-bold-duotone';
import SolarSliderVerticalBoldDuotone from '~icons/solar/slider-vertical-bold-duotone';

export const COMMANDS = [
	{
		type: 'note',
		label: 'Note',
		bgColor: '#741D30',
		textColor: '#D14866',
		placeholder: 'Title',
		boxShadow:
			'0px 4px 9px rgba(18, 18, 22, 0.2), inset 0px 1px 0px #AF4262, inset 0px 0px 0px 1px #922A43',
		icon: SolarPenNewSquareBoldDuotone
	},
	{
		type: 'upload',
		label: 'Upload',
		bgColor: '#9F672B',
		textColor: '#D8A24D',
		placeholder: 'Title',
		boxShadow:
			'0px 4px 9px rgba(18, 18, 22, 0.2), inset 0px 1px 0px #DF8524, inset 0px 0px 0px 1px #B56E21',
		icon: SolarSliderVerticalBoldDuotone
	},
	{
		type: 'space',
		label: 'Space',
		bgColor: '#2B9F5D',
		textColor: '#4DD896',
		placeholder: 'Space name',
		boxShadow:
			'0px 4px 9px rgba(18, 18, 22, 0.2), inset 0px 1px 0px #24DF75, inset 0px 0px 0px 1px #21B561',
		icon: SolarSliderVerticalBoldDuotone
	},
	{
		type: 'branch',
		label: 'Branch',
		bgColor: '#2B7A9F',
		textColor: '#4DACD8',
		placeholder: 'Branch name',
		boxShadow:
			'0px 4px 9px rgba(18, 18, 22, 0.2), inset 0px 1px 0px #24A4DF, inset 0px 0px 0px 1px #2186B5',
		icon: SolarSliderVerticalBoldDuotone
	}
	// 	{
	// 		type: 'flashCard',
	// 		label: 'Flash Card',
	// 		color: '#3F8434',
	// 		textColor: '#68BE5A',
	// 		boxShadow:
	// 			'0px 4px 9px rgba(18, 18, 22, 0.2), inset 0px 1px 0px #6DC15C, inset 0px 0px 0px 1px #56A348',
	// 		icon: SolarSliderVerticalBoldDuotone
	// 	}
] as const;

export type TCommands = typeof COMMANDS;

import SolarPenNewSquareBoldDuotone from '~icons/solar/pen-new-square-bold-duotone';
import SolarSliderVerticalBoldDuotone from '~icons/solar/slider-vertical-bold-duotone';

const COMMANDS = [
	{
		type: 'note',
		label: 'Note',
		color: '#741D30',
		textColor: '#D14866',
		bgColor: '#190B0E8C',
		boxShadow:
			'0px 4px 9px rgba(18, 18, 22, 0.2), inset 0px 1px 0px #AF4262, inset 0px 0px 0px 1px #922A43',
		icon: SolarPenNewSquareBoldDuotone
	},
	{
		type: 'flashCard',
		label: 'Flash Card',
		color: '#3F8434',
		textColor: '#68BE5A',
		bgColor: '#0D190B8C',
		boxShadow:
			'0px 4px 9px rgba(18, 18, 22, 0.2), inset 0px 1px 0px #6DC15C, inset 0px 0px 0px 1px #56A348',
		icon: SolarSliderVerticalBoldDuotone
	}
] as const;

class Search {
	activeCommand = $state<(typeof COMMANDS)[number]>();
	effect = $state(false);

	isCommand(query: string) {
		const command = COMMANDS.find((c) => c.type.startsWith(query));
		if (command) {
			this.activeCommand = command;

			return true;
		}

		return false;
	}

	resetCommand() {
		this.activeCommand = undefined;
	}

	executeEffect() {
		this.effect = true;

		setTimeout(() => {
			this.effect = false;
		}, 150);
	}
}

export const search = new Search();

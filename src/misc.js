(function () {
	'use strict';
	
	const pegs = `achieve agape aim alien align amuse annual arrive arrow assess assign assume aurora awesome baby back bad balmy ban bead beef bell berry bike bite blue bomb bony boss bury bushy busy buy cage cake carry cat catchy cave cha-cha chain chase chatty cheap cheat check cheese cheetah chef cherry chew chick chief chill chilli chin choosy chop clay coach coin comb cook cool copy cosy cow crow cube daisy deaf deep defy diary dish dizzy dog dome dove draw dry easy edit elite emery enemy enjoy envy erase fab fairy fake fan fat fave fetch fife fig fight fine fishy fly foamy fob foggy fool foul fry fume funny furry fuse fussy game gay gem give good goofy goose grey gummy hairy happy haram hat hate heal heavy help hen home honeybee honour hoof hook hose hot inhale ionize itchy jam jeep jewish jolly judge jury keen kill kiss knife knock know lady lame latch lava lazy leafy leech leery leg let lick lily lime lion lip loom loopy lorry lose louse love loyal lucky lull lure lush mail male map marry mash match mauve meadow mean meet merry messy mime mine mock mole moon mop mouse move movie mucky mug mum mummy mushy mute nab nacho naggy nail naive name nanny narrow neat neck neon net new noisy nose nudgy numb oily onion oppose ovum patch pave peel pie pipe poke pony pop pouch pro puffy puma quick quote rag railway rake ram rare reach read ready rear rice rich ripe roach road rocky roof rope rosy rough row royal ruin rule rum runny sad sappy sauce save savvy seed sell sew sewage shaky sham shiny shoe shrew sick sierra sissy sky slow snowy soak soap sob sofa soil sorrow sorry sumo sun swat swishy switch tail take tall tame tattoo teach tease tell thick tight time tuba tuna type unite urine vase veggie vibe video view viva wannabe weaken whale whitish widen wimpy winery wooden wrap yummy`
	
	if (sessionStorage) {
		sessionStorage.setItem('pegs', pegs);
	} else {
		console.warn('Can\'t set sessionStorage')
	}
	
})();
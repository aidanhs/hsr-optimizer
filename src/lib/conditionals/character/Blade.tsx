import React from 'react';
import { Stats } from 'lib/constants';
import { ASHBLAZING_ATK_STACK, baseComputedStatsObject } from 'lib/conditionals/constants';
import { basicRev, calculateAshblazingSet, precisionRound, skillRev, talentRev, ultRev } from 'lib/conditionals/utils';

import DisplayFormControl from 'components/optimizerForm/conditionals/DisplayFormControl';
import { FormSwitchWithPopover } from 'components/optimizerForm/conditionals/FormSwitch';
import { FormSliderWithPopover } from 'components/optimizerForm/conditionals/FormSlider';

import { Eidolon } from 'types/Character'
import { PrecomputedCharacterConditional } from 'types/CharacterConditional';
import { Form } from 'types/Form';


export default (e: Eidolon) => {
  const enhancedStateDmgBoost = skillRev(e, 0.40, 0.456)
  const hpPercentLostTotalMax = 0.90

  const basicScaling = basicRev(e, 1.0, 1.1)
  const basicEnhancedAtkScaling = skillRev(e, 0.40, 0.44)
  const basicEnhancedHpScaling = skillRev(e, 1.00, 1.10)
  const ultAtkScaling = ultRev(e, 0.40, 0.432)
  const ultHpScaling = ultRev(e, 1.00, 1.08)
  const ultLostHpScaling = ultRev(e, 1.00, 1.08)
  const fuaAtkScaling = talentRev(e, 0.44, 0.484)
  const fuaHpScaling = talentRev(e, 1.10, 1.21)

  const hitMultiByTargets = {
    1: ASHBLAZING_ATK_STACK * (1 * 0.33 + 2 * 0.33 + 3 * 0.34),
    3: ASHBLAZING_ATK_STACK * (2 * 0.33 + 5 * 0.33 + 8 * 0.34),
    5: ASHBLAZING_ATK_STACK * (3 * 0.33 + 8 * 0.33 + 8 * 0.34),
  };

  const content = [{
    formItem: FormSwitchWithPopover,
    id: 'enhancedStateActive',
    name: 'enhancedStateActive',
    text: 'Hellscape state',
    title: 'Hellscape state',
    content: `
      Increases DMG by ${precisionRound(enhancedStateDmgBoost * 100)}% and his Basic ATK Shard Sword is enhanced to Forest of Swords for 3 turn(s).
      ::BR::
      E2: Increases CRIT Rate by ${precisionRound(0.15 * 100)}%.
    `,
  }, {
    formItem: FormSliderWithPopover,
    id: 'hpPercentLostTotal',
    name: 'hpPercentLostTotal',
    text: 'HP% lost total',
    title: 'HP% lost total',
    content: `Ultimate DMG scales off of the tally of Blade's HP loss in the current battle. 
    The tally of Blade's HP loss in the current battle is capped at ${precisionRound(hpPercentLostTotalMax * 100)}% of his Max HP.`,
    min: 0,
    max: hpPercentLostTotalMax,
    percent: true,
  }, {
    formItem: FormSliderWithPopover,
    id: 'e4MaxHpIncreaseStacks',
    name: 'e4MaxHpIncreaseStacks',
    text: 'E4 max HP stacks',
    title: 'E4 max HP stacks',
    content: `E4: Increases HP by ${precisionRound(0.20 * 100)}%, stacks up to 2 times.`,
    min: 0,
    max: 2,
    disabled: e < 4,
  }];

  return {
    display: () => <DisplayFormControl content={content} />,
    defaults: () => ({
      enhancedStateActive: true,
      hpPercentLostTotal: hpPercentLostTotalMax,
      e4MaxHpIncreaseStacks: 2,
    }),
    precomputeEffects: (request: Form) => {
      const r = request.characterConditionals
      const x = Object.assign({}, baseComputedStatsObject)

      // Stats
      x[Stats.CR] += (e >= 2 && r.enhancedStateActive) ? 0.15 : 0
      x[Stats.HP_P] += (e >= 4) ? r.e4MaxHpIncreaseStacks * 0.20 : 0

      // Scaling
      x.BASIC_SCALING += basicScaling
      // Rest of the scalings are calculated dynamically

      // Boost
      x.ELEMENTAL_DMG += r.enhancedStateActive ? enhancedStateDmgBoost : 0
      x.FUA_BOOST += 0.20

      return x
    },
    calculateBaseMultis: (c: PrecomputedCharacterConditional, request: Form) => {
      const r = request.characterConditionals
      const x = c['x'];

      if (r.enhancedStateActive) {
        x.BASIC_DMG += basicEnhancedAtkScaling * x[Stats.ATK]
        x.BASIC_DMG += basicEnhancedHpScaling * x[Stats.HP]
      } else {
        x.BASIC_DMG += x.BASIC_SCALING * x[Stats.ATK]
      }

      x.ULT_DMG += ultAtkScaling * x[Stats.ATK]
      x.ULT_DMG += ultHpScaling * x[Stats.HP]
      x.ULT_DMG += ultLostHpScaling * r.hpPercentLostTotal * x[Stats.HP]
      x.ULT_DMG += (e >= 1 && request.enemyCount == 1) ? 1.50 * r.hpPercentLostTotal * x[Stats.HP] : 0

      const hitMulti = hitMultiByTargets[request.enemyCount]
      const { ashblazingMulti, ashblazingAtk } = calculateAshblazingSet(c, request, hitMulti)
      x.FUA_DMG += fuaAtkScaling * (x[Stats.ATK] - ashblazingAtk + ashblazingMulti)

      x.FUA_DMG += fuaHpScaling * x[Stats.HP]
      x.FUA_DMG += (e >= 6) ? 0.50 * x[Stats.HP] : 0
    }
  }
}

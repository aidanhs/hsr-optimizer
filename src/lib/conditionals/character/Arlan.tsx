import React from 'react';
import { Stats } from 'lib/constants';
import { baseComputedStatsObject } from 'lib/conditionals/constants';
import { basic, precisionRound, skill, talent, ult } from 'lib/conditionals/utils';

import DisplayFormControl from 'components/optimizerForm/conditionals/DisplayFormControl';
import { FormSliderWithPopover } from 'components/optimizerForm/conditionals/FormSlider';

import { Eidolon } from 'types/Character'
import { PrecomputedCharacterConditional } from 'types/CharacterConditional';
import { Form } from 'types/Form';

export default (e: Eidolon) => {
  const basicScaling = basic(e, 1.00, 1.10)
  const skillScaling = skill(e, 2.40, 2.64)
  const ultScaling = ult(e, 3.20, 3.456)

  const talentMissingHpDmgBoostMax = talent(e, 0.72, 0.792)

  const content = [{
    formItem: FormSliderWithPopover,
    id: 'selfCurrentHpPercent',
    name: 'selfCurrentHpPercent',
    text: 'Self current HP%',
    title: 'Self current HP%',
    content: `Increases Arlan's DMG for every percent of HP below his Max HP, up to a max of ${precisionRound(talentMissingHpDmgBoostMax * 100)}% more DMG.`,
    min: 0.01,
    max: 1.0,
    percent: true,
  }];

  return {
    display: () => <DisplayFormControl content={content} />,
    defaults: () => ({
      selfCurrentHpPercent: 1.00,
    }),
    precomputeEffects: (request: Form) => {
      const r = request.characterConditionals
      const x = Object.assign({}, baseComputedStatsObject)

      // Stats
      x.ELEMENTAL_DMG += Math.min(talentMissingHpDmgBoostMax, 1 - r.selfCurrentHpPercent)

      // Scaling
      x.BASIC_SCALING += basicScaling
      x.SKILL_SCALING += skillScaling
      x.ULT_SCALING += ultScaling

      // Boost
      x.SKILL_BOOST += (e >= 1 && r.selfCurrentHpPercent <= 0.50) ? 0.10 : 0
      x.ULT_BOOST += (e >= 6 && r.selfCurrentHpPercent <= 0.50) ? 0.20 : 0

      return x
    },
    calculateBaseMultis: (c: PrecomputedCharacterConditional) => {
      const x = c['x'];

      x.BASIC_DMG += x.BASIC_SCALING * x[Stats.ATK]
      x.SKILL_DMG += x.SKILL_SCALING * x[Stats.ATK]
      x.ULT_DMG += x.ULT_SCALING * x[Stats.ATK]
      x.FUA_DMG += 0
    }
  }
}

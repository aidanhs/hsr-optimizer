import { Constants } from 'lib/constants';
import { Gradient } from 'lib/gradient';
import { Renderer } from 'lib/renderer';

export const DIGITS_4 = 50;
export const DIGITS_5 = 60;

export const baseColumnDefs = [
  { field: 'relicSetIndex', cellRenderer: Renderer.relicSet, width: 70, headerName: 'Set' },
  { field: 'ornamentSetIndex', cellRenderer: Renderer.ornamentSet, width: 50, headerName: 'Set' },

  { field: Constants.Stats.ATK, valueFormatter: Renderer.floor, width: DIGITS_4, cellStyle: Gradient.getOptimizerColumnGradient },
  { field: Constants.Stats.DEF, valueFormatter: Renderer.floor, width: DIGITS_4, cellStyle: Gradient.getOptimizerColumnGradient },
  { field: Constants.Stats.HP, valueFormatter: Renderer.floor, width: DIGITS_4, cellStyle: Gradient.getOptimizerColumnGradient },
  { field: Constants.Stats.SPD, valueFormatter: Renderer.tenths, width: DIGITS_4, cellStyle: Gradient.getOptimizerColumnGradient },
  { field: Constants.Stats.CR, valueFormatter: Renderer.x100Tenths, width: DIGITS_4, headerName: 'CR', cellStyle: Gradient.getOptimizerColumnGradient },
  { field: Constants.Stats.CD, valueFormatter: Renderer.x100Tenths, width: DIGITS_4, headerName: 'CD', cellStyle: Gradient.getOptimizerColumnGradient },
  { field: Constants.Stats.EHR, valueFormatter: Renderer.x100Tenths, width: DIGITS_4, headerName: 'EHR', cellStyle: Gradient.getOptimizerColumnGradient },
  { field: Constants.Stats.RES, valueFormatter: Renderer.x100Tenths, width: DIGITS_4, headerName: 'RES', cellStyle: Gradient.getOptimizerColumnGradient },
  { field: Constants.Stats.BE, valueFormatter: Renderer.x100Tenths, width: DIGITS_4, headerName: 'BE', cellStyle: Gradient.getOptimizerColumnGradient },
  { field: Constants.Stats.ERR, valueFormatter: Renderer.x100Tenths, width: DIGITS_4, headerName: 'ERR' },
  { field: Constants.Stats.OHB, valueFormatter: Renderer.x100Tenths, width: DIGITS_4, headerName: 'HEAL' },

  { field: 'ED', valueFormatter: Renderer.x100Tenths, width: DIGITS_4, headerName: 'ELEM' },
  { field: 'CV', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'CV' },
  { field: 'EHP', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'EHP' },
  { field: 'WEIGHT', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'WEIGHT' },

  { field: 'BASIC', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'BASIC' },
  { field: 'SKILL', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'SKILL' },
  { field: 'ULT', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'ULT' },
  { field: 'FUA', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'FUA' },
  { field: 'DOT', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'DOT' },
];

export const combatColumnDefs = [
  { field: 'relicSetIndex', cellRenderer: Renderer.relicSet, width: 70, headerName: 'Set' },
  { field: 'ornamentSetIndex', cellRenderer: Renderer.ornamentSet, width: 50, headerName: 'Set' },

  { field: 'xATK', valueFormatter: Renderer.floor, width: DIGITS_4, cellStyle: Gradient.getOptimizerColumnGradient, headerName: 'Σ ATK' },
  { field: 'xDEF', valueFormatter: Renderer.floor, width: DIGITS_4, cellStyle: Gradient.getOptimizerColumnGradient, headerName: 'Σ DEF' },
  { field: 'xHP', valueFormatter: Renderer.floor, width: DIGITS_4, cellStyle: Gradient.getOptimizerColumnGradient, headerName: 'Σ HP' },
  { field: 'xSPD', valueFormatter: Renderer.tenths, width: DIGITS_4, cellStyle: Gradient.getOptimizerColumnGradient, headerName: 'Σ SPD' },
  { field: 'xCR', valueFormatter: Renderer.x100Tenths, width: DIGITS_4, cellStyle: Gradient.getOptimizerColumnGradient, headerName: 'Σ CR' },
  { field: 'xCD', valueFormatter: Renderer.x100Tenths, width: DIGITS_4, cellStyle: Gradient.getOptimizerColumnGradient, headerName: 'Σ CD' },
  { field: 'xEHR', valueFormatter: Renderer.x100Tenths, width: DIGITS_4, cellStyle: Gradient.getOptimizerColumnGradient, headerName: 'Σ EHR' },
  { field: 'xRES', valueFormatter: Renderer.x100Tenths, width: DIGITS_4, cellStyle: Gradient.getOptimizerColumnGradient, headerName: 'Σ RES' },
  { field: 'xBE', valueFormatter: Renderer.x100Tenths, width: DIGITS_4, cellStyle: Gradient.getOptimizerColumnGradient, headerName: 'Σ BE' },
  { field: 'xERR', valueFormatter: Renderer.x100Tenths, width: DIGITS_4, headerName: 'Σ ERR' },
  { field: 'xOHB', valueFormatter: Renderer.x100Tenths, width: DIGITS_4, headerName: 'Σ HEAL' },

  { field: 'xELEMENTAL_DMG', valueFormatter: Renderer.x100Tenths, width: DIGITS_4, headerName: 'Σ ELEM' },
  { field: 'CV', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'CV' },
  { field: 'EHP', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'EHP' },
  { field: 'WEIGHT', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'WEIGHT' },

  { field: 'BASIC', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'BASIC' },
  { field: 'SKILL', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'SKILL' },
  { field: 'ULT', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'ULT' },
  { field: 'FUA', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'FUA' },
  { field: 'DOT', valueFormatter: Renderer.floor, width: DIGITS_5, headerName: 'DOT' },
];

export const gridOptions = {
  rowHeight: 33,
  pagination: true,
  rowSelection: 'single',
  rowModelType: 'infinite',
  datasource: null,
  paginationPageSize: 500,
  paginationPageSizeSelector: [100, 500, 1000],
  cacheBlockSize: 500,
  suppressDragLeaveHidesColumns: true,
  suppressScrollOnNewData: true,
  suppressMultiSort: true,
  suppressCellFocus: true
};

export const defaultColDef = {
  cellStyle: Gradient.getOptimizerColumnGradient,
  sortable: true,
  sortingOrder: ['desc', 'asc']
};

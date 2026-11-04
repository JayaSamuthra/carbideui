# Release Notes — v1.4.1

Patch release. No breaking changes and no action needed to upgrade. It fixes two bugs found in an app using
1.4.0, and makes the tab component meet common enterprise sizing expectations.

## Fixes

### Content switcher: tabs lost their dividers and showed boxed borders
`ngcc-content-switcher-option` wraps each button, so Carbon's sibling-based rules (`:first-child`,
`:last-child`, `+`) treated every button as both the first and the last. Every segment got outer borders and
rounded ends, and the dividers between segments disappeared.

- A new global partial (`styles/_content-switcher.scss`, included by `@assistanz/carbideui/styles/carbon`)
  styles the segments by their position: rounded outer ends, dividers between neighbours, and no divider
  next to a hovered, focused or selected segment. It uses Carbon tokens and no `!important`.
- Each option now takes an equal share of the switcher's width.
- **If you added a workaround** in your own stylesheet for this bug, you can delete it after upgrading.
- The markup is unchanged, so `<ngcc-content-switcher-option>` keeps working as before.

### Color theme switcher: wrong highlight, and plain Carbon unreachable with a default preset
- **Wrong chip on load.** The "Starting point" chips kept their own selection, which always began on
  *Carbon*, so an app with `provideNgccColorTheme({ defaultPreset: 'ocean' })` showed Ocean colors with
  Carbon highlighted. The highlight now comes from the colors actually applied, so it is right on load, after
  a reload and after other changes.
- **Carbon did nothing useful.** The *Carbon* chip ran "reset to defaults", which returns to the app's
  default preset, so with a default preset set it re-applied that preset. It now applies plain Carbon (Carbon
  blue, no customization) and the choice is saved across reloads.
- **Reset to defaults** is unchanged: it still returns to the app's default preset.

New on `NgccColorThemeService`:

| API | Details |
|---|---|
| `resetToCarbon()` | Plain Carbon, whatever `defaultPreset` is |
| `activePresetId()` | Signal: preset id, `'carbon'`, or `''` when the colors are customized |

## Improvements

### Tabs: sizing for enterprise layouts
| Situation | Behavior |
|---|---|
| 2–4 tabs | Equal widths across the row |
| 5 or more tabs | Width follows the label; the list scrolls horizontally when it does not fit |
| Narrow screens | The list scrolls instead of squeezing labels; a tab is never narrower than 7rem |
| Long labels | Never wrap. Labels over 20rem are cut with an ellipsis, and the full label shows as a tooltip only when it is actually cut off |

Notes: the tooltip applies to plain-text headings, not custom heading templates. The `title` input on
`ngcc-tab` is still not rendered. Previously Carbon stretched every tab to fill the row, so widths were uneven
and long labels were clipped with no way to read them.

## Documentation
- README (the one shown on npm): corrected the Sass import to `@assistanz/carbideui/styles/carbon`, added
  Layout & Display and Theming sections, fixed the theme troubleshooting advice, updated the compatibility
  table (Angular `>=20 <22`, `@carbon/styles ^1.102.0`) and the documentation links.
- `docs/COMPONENT_USAGE_REFERENCE.md`: tab sizing; the tabs example now uses the real `heading` input.
- `docs/V1.4.0_USAGE_REFERENCE.md`: starting-point behavior, `resetToCarbon()` and `activePresetId()`.

## Tests
New tests cover the active-preset signal, reaching Carbon with a default preset (including after a reload),
the content-switcher stylesheet, and tab sizing and tooltips.

## Upgrade
No action needed. To pick up the content-switcher fix, make sure your global stylesheet uses
`@use '@assistanz/carbideui/styles/carbon';`.

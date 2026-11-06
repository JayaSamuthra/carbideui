# Release Notes — v1.5.0

Minor release: the notification panel can now be translated, fits narrow containers, shows severity
without relying on color, and the header panel can be resized and dismissed from the keyboard.
Existing apps keep working; one accessibility role changed (see Behavior change).

## Notification list (`ngcc-notification-list`)

| Addition | Details |
|---|---|
| **Translatable text** | New `labels` input covering every fixed string: Mark all read, Clear all, the unread prefix, `{count} unread`, `Dismiss {title}` and the four severity names. Missing keys keep their English default. Exports `NgccNotificationListLabels` and `NGCC_NOTIFICATION_LIST_LABELS` |
| **Narrow containers** | The header actions are icon plus text and collapse to icon only when the list is narrower than 22rem (a container query, so it follows the list, not the viewport). The text stays available to screen readers and as a tooltip. The header row can wrap |
| **Severity without color** | Every item, read or unread, shows a severity icon (information, success, warning, error) and a visually hidden text label. Color is no longer the only signal (WCAG 1.4.1) |

```html
<ngcc-notification-list
  [items]="items()"
  [labels]="{ markAllRead: 'Tout marquer comme lu', unreadCount: '{count} non lues', dismiss: 'Ignorer {title}' }"
/>
```

### States, structure and content (new)

| Addition | Details |
|---|---|
| **Loading** | `loading` shows skeleton rows (`aria-label` from `labels.loading`) while there are no items |
| **Error and stale** | `error` (boolean or message) with a `retry` output. With no items it shows an error state; with items it keeps the last list and shows a "could not refresh" notice with Retry |
| **Empty state** | Uses `ngcc-empty-state` with `emptyTitle`, `emptyDescription` (falls back to `emptyText`), `emptyIcon` and an `[ngccNotificationEmptyAction]` slot |
| **Time and grouping** | New item field `time` (Date, ISO string or epoch ms) renders `<time datetime>` with relative text via `Intl.RelativeTimeFormat` (follows `locale` or the page language). `groupBy="day"` adds Today / Yesterday / date headings (`labels.groupToday`, `groupYesterday`). `timestamp` still works as pre-formatted text |
| **Unread vs read** | Unread items get a dot and a bold title; read items are calmer (regular weight, secondary color). Screen-reader text is kept |
| **Item content** | `messageLines` clamps messages (full text in a tooltip); items accept `href` or `routerLink` (rendered as links, `itemClicked` still fires); a `ng-template[ngccNotificationLeading]` renders an icon or avatar per item; a per-item "mark as read" button and the new `markRead` output |
| **Item actions** | Mark read and dismiss are 32px, revealed on hover and keyboard focus, always visible on touch devices |
| **Footer and paging** | `[ngccNotificationFooter]` slot; `hasMore` shows "Load more" and emits `loadMore` |
| **Live announcement** | `announceNew` announces new unread arrivals politely (`labels.newNotifications`) |
| **Count badge** | `countVariant="neutral"` for a non-red badge; colors come from tokens |

## Header action (`ngcc-header-action`)
New `badge` input: `'dot'` or a count (hidden at 0, shown as `99+` above `badgeMax`). The count is added to the
button's accessible name (`badgeLabel`, default `{count} unread`) and the badge has a ring so it separates from
the icon on any theme. Style the ring with `--ngcc-header-action-ring`.

## Header panel (`ngcc-header-panel`)

| Addition | Details |
|---|---|
| **Width** | `width` input (any CSS length) or the `--ngcc-header-panel-width` custom property. Never wider than the viewport. Default stays 16rem |
| **Dismissal** | Escape and a click outside emit the new `closed` output; set `expanded` to false in response. `closeOnOutsideClick` turns the click off. A click on a `ngcc-header-action` or on any element with `aria-expanded` is not an outside click, so the opening control can still toggle the panel |
| **Focus** | Focus returns to the element that had it when the panel opened, if focus was inside the panel or lost |
| **Size** | `size="content"` fits the panel to its content (up to the viewport height); the default fills the height. `[ngccPanelFooter]` stays pinned at the bottom |
| **Surface** | Background is `--ngcc-header-panel-background` (default `--cds-layer-01`); set it to match your header under tinted color themes |
| **Motion** | The slide transition is disabled under `prefers-reduced-motion` |
| **Collapsed state** | A collapsed panel is `inert`, so its content can no longer be reached with the keyboard |

```html
<ngcc-header-panel
  [expanded]="open"
  ariaLabel="Notifications"
  width="24rem"
  (closed)="open = false"
>
  <ngcc-notification-list [items]="items()" />
</ngcc-header-panel>
```

## Behavior change
The header panel's role is now `dialog` (non-modal, named by `ariaLabel`) instead of `complementary`, which
better describes a transient overlay. Update tests or selectors that look for `role="complementary"`.

## Not in this release
The panel does not read the header's own theme automatically (you set `--ngcc-header-panel-background`),
and `NgccI18nService` is not wired in; pass translated strings through `labels`.

## Upgrade
No action needed. To translate the list, pass `labels`. To let the panel close itself, bind `(closed)`.

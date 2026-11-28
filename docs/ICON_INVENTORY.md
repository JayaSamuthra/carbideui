# Cloud icon inventory

Adds 177 cloud-focused icon names (175 distinct glyphs, 2 aliases) to the `ICONS` registry (`ngcc-icon`), alongside the 70 existing ones.

## Design rules (unchanged)

- Carbon-compatible filled glyphs, `viewBox="0 0 32 32"`, `currentColor` fill, snake_case names.
- Rendered by the existing `<ngcc-icon>`; no new component, no runtime icon dependency.
- Paths were adapted from Carbon icons (Apache-2.0) at build-authoring time; only 2 icons are hand-built
  (`cloud_check`, `cloud_sync`: Carbon's cloud outline plus a check / sync arrows).
- Existing names are untouched. New icons live in `lib/ngcc-icons/categories/<category>.ts`, are merged into
  `ICONS`, and each set (`computeIcons`, `storageIcons`, ...) is also exported for direct import.

## Usage

```html
<ngcc-icon name="virtual_machine" size="lg" ariaLabel="Virtual machine"></ngcc-icon>
<ngcc-icon name="cloud_alert" [decorative]="true" color="var(--cds-support-warning)"></ngcc-icon>
```

`NgccIconNameType` is the union of every key, so names autocomplete and typos fail to compile.

## Audit of existing icons

Already present and reused instead of re-added: `cloud`, `server`, `globe`, `cpu`, `memory`, `network`, `disk`,
`lock`, `unlock`, `user`, `user_multi` (users), `user_avatar` (profile), `activity`, `notification` (bell),
`home`, `menu`, `search`, `filter`, `download`, `upload`, `add`, `close`, `edit`, `delete`, `copy`, `refresh`,
`time` (clock), `calendar`, `email` (mail), `link`, `billing`, `support`, `license`, `configuration`/`settings_adjust`
(settings), `information`/`info_filled` (info), `warn`/`warning_filled`, `error`/`error_filled`, `checkmark`,
`view`/`hide` (eye / eye-off), `user_avatar` (user circle / profile), `overflow_menu_vertical` (more-vertical),
`chevron_*`, `overflow_menu_vertical`, `sort_icon`, `arrow_up`/`arrow_down`.

## Naming differences from the original proposal

The proposal used kebab-case; the registry is snake_case, so `load-balancer` is `load_balancer`. Where a requested
name would collide with an existing icon or another category, it was renamed or skipped: `switch` is
`network_switch`, Kubernetes `service` is `k8s_service`, and `persistent_volume` / `storage_class` /
`deployment` appear once (storage, storage, Kubernetes). `volume` and `persistent_volume` are aliases of
`block_storage` (same object, no extra bytes). `eye`, `eye_off`, `more_vertical`, `user_circle`, `users` and
`user` were not added because `view`, `hide`, `overflow_menu_vertical`, `user_avatar`, `user_multi` and `user` exist.

## Inventory

### Cloud infrastructure (12)

| Icon | Purpose | Source |
|---|---|---|
| `cloud_upload` | Upload to cloud | Carbon `cloud--upload` |
| `cloud_download` | Download from cloud | Carbon `cloud--download` |
| `cloud_sync` | Cloud synchronization | custom |
| `cloud_check` | Cloud service available | custom |
| `cloud_alert` | Cloud service warning | Carbon `cloud--alerting` |
| `cloud_off` | Cloud service unavailable | Carbon `cloud--offline` |
| `server_stack` | Server cluster | Carbon `bare-metal-server--02` |
| `datacenter` | Data center | Carbon `data--center` |
| `infrastructure` | Infrastructure management | Carbon `infrastructure--classic` |
| `region` | Cloud region | Carbon `earth--americas` |
| `availability_zone` | Availability zone | Carbon `ibm-cloud--resiliency` |
| `resource_group` | Resource grouping | Carbon `group--resource` |

### Compute & virtual machines (19)

| Icon | Purpose | Source |
|---|---|---|
| `virtual_machine` | Virtual machine | Carbon `virtual-machine` |
| `processor` | Processor | Carbon `chip` |
| `desktop` | Desktop instance | Carbon `virtual-desktop` |
| `terminal` | Terminal access | Carbon `terminal` |
| `container` | Container | Carbon `container-software` |
| `containers` | Container management | Carbon `container-services` |
| `instance` | Cloud instance | Carbon `instance--virtual` |
| `instance_running` | Running instance | Carbon `play--filled--alt` |
| `instance_stopped` | Stopped instance | Carbon `stop--filled--alt` |
| `instance_paused` | Paused instance | Carbon `pause--filled` |
| `power_on` | Start VM | Carbon `power` |
| `power_off` | Stop VM | Carbon `stop--outline` |
| `restart` | Restart VM | Carbon `restart` |
| `resize` | Resize instance | Carbon `fit-to-screen` |
| `snapshot` | VM snapshot | Carbon `ibm-cloud--vpc-block-storage-snapshots` |
| `machine_image` | Machine image | Carbon `ibm-cloud--vpc-images` |
| `scale_up` | Scale up | Carbon `intent-request--scale-out` |
| `scale_down` | Scale down | Carbon `intent-request--scale-in` |
| `bare_metal` | Bare metal server | Carbon `bare-metal-server` |

### Networking & connectivity (19)

| Icon | Purpose | Source |
|---|---|---|
| `network_interface` | Network interface | Carbon `network-interface` |
| `vpc` | Virtual private cloud | Carbon `virtual-private-cloud` |
| `subnet` | Subnet | Carbon `ibm-cloud--subnets` |
| `router` | Router | Carbon `router` |
| `network_switch` | Network switch | Carbon `switch-layer-2` |
| `firewall` | Firewall | Carbon `firewall` |
| `load_balancer` | Load balancer | Carbon `load-balancer--application` |
| `gateway` | Gateway | Carbon `gateway` |
| `internet` | Internet connectivity | Carbon `wifi` |
| `public_ip` | Public IP | Carbon `floating-ip` |
| `private_ip` | Private IP | Carbon `network--admin-control` |
| `dns` | DNS management | Carbon `dns-services` |
| `domain` | Domain | Carbon `ibm-cloud--internet-services` |
| `vpn` | VPN connection | Carbon `vpn--connection` |
| `bandwidth` | Bandwidth | Carbon `meter--alt` |
| `traffic` | Network traffic | Carbon `flow--stream` |
| `port` | Network port | Carbon `port--input` |
| `endpoint` | Network endpoint | Carbon `ibm-cloud--vpc-endpoints` |
| `connection` | Connectivity | Carbon `connect` |

### Storage management (17)

| Icon | Purpose | Source |
|---|---|---|
| `storage` | Storage | Carbon `storage-pool` |
| `hard_drive` | Hard drive | Carbon `data--base--alt` |
| `volume` | Storage volume | alias of `block_storage` |
| `block_storage` | Block storage | Carbon `volume--block-storage` |
| `object_storage` | Object storage | Carbon `volume--object-storage` |
| `file_storage` | File storage | Carbon `volume--file-storage` |
| `database` | Database | Carbon `data--base` |
| `database_cluster` | Database cluster | Carbon `data--connected` |
| `folder` | Folder | Carbon `folder` |
| `file` | File | Carbon `document--blank` |
| `backup` | Backup | Carbon `ibm-cloud--backup-and-recovery` |
| `restore` | Restore | Carbon `rotate--counterclockwise` |
| `archive` | Archive | Carbon `archive` |
| `storage_class` | Storage class | Carbon `data--structured` |
| `persistent_volume` | Persistent volume | alias of `block_storage` |
| `storage_capacity` | Storage capacity | Carbon `chart--ring` |
| `disk_usage` | Disk usage | Carbon `chart--bar-stacked` |

### Kubernetes & containers (20)

| Icon | Purpose | Source |
|---|---|---|
| `kubernetes` | Kubernetes | Carbon `kubernetes` |
| `cluster` | Cluster | Carbon `assembly--cluster` |
| `node` | Cluster node | Carbon `kubernetes--worker-node` |
| `control_plane_node` | Control plane node | Carbon `kubernetes--control-plane-node` |
| `node_pool` | Node pool | Carbon `software-resource--cluster` |
| `pod` | Pod | Carbon `kubernetes--pod` |
| `deployment` | Deployment | Carbon `deploy` |
| `namespace` | Namespace | Carbon `layers` |
| `k8s_service` | Kubernetes service | Carbon `settings--services` |
| `ingress` | Ingress | Carbon `gateway--public` |
| `helm` | Helm package | Carbon `package` |
| `config_map` | ConfigMap | Carbon `document--configuration` |
| `secret` | Secret | Carbon `password` |
| `persistent_volume_claim` | Persistent volume claim | Carbon `storage-request` |
| `horizontal_scaling` | Horizontal scaling | Carbon `arrows--horizontal` |
| `autoscaling` | Autoscaling | Carbon `autoscaling` |
| `workload` | Workload | Carbon `software-resource` |
| `replica` | Replica | Carbon `replicate` |
| `container_registry` | Container registry | Carbon `container-registry` |
| `operator` | Kubernetes operator | Carbon `kubernetes--operator` |

### Security & access management (18)

| Icon | Purpose | Source |
|---|---|---|
| `shield` | Security | Carbon `security` |
| `shield_check` | Security verified | Carbon `undefined` |
| `shield_alert` | Security alert | Carbon `warning--hex` |
| `key` | Access key | Carbon `api--key` |
| `key_management` | Key management | Carbon `ibm-cloud--key-protect` |
| `user_role` | User role | Carbon `user--role` |
| `user_permissions` | Permissions | Carbon `user--access` |
| `identity` | Identity management | Carbon `user--identification` |
| `iam` | Identity and access management | Carbon `user--settings` |
| `authentication` | Authentication | Carbon `fingerprint-recognition` |
| `authorization` | Authorization | Carbon `user--access-unlocked` |
| `access_locked` | Access locked | Carbon `user--access-locked` |
| `certificate` | SSL certificate | Carbon `certificate` |
| `encryption` | Encryption | Carbon `encryption` |
| `audit_log` | Audit logs | Carbon `cloud--auditing` |
| `compliance` | Compliance | Carbon `ibm-cloud--security-compliance-center` |
| `access_control` | Access control | Carbon `ibm-cloud--security-groups` |
| `hsm` | Hardware security module | Carbon `hardware-security-module` |

### Monitoring & observability (18)

| Icon | Purpose | Source |
|---|---|---|
| `monitoring` | Monitoring | Carbon `cloud--monitoring` |
| `dashboard` | Dashboard | Carbon `dashboard` |
| `chart_line` | Performance trends | Carbon `chart--line` |
| `chart_bar` | Usage statistics | Carbon `chart--bar` |
| `chart_pie` | Resource distribution | Carbon `chart--pie` |
| `metrics` | Metrics | Carbon `analytics` |
| `logs` | Logs | Carbon `cloud--logging` |
| `alert` | Alert | Carbon `alarm` |
| `health` | Service health | Carbon `health-cross` |
| `heartbeat` | System heartbeat | Carbon `chart--line-smooth` |
| `performance` | Performance | Carbon `meter` |
| `latency` | Latency | Carbon `timer` |
| `cpu_usage` | CPU usage | Carbon `chart--radial` |
| `memory_usage` | Memory usage | Carbon `chart--area` |
| `network_usage` | Network usage | Carbon `chart--network` |
| `status_success` | Successful status | Carbon `checkmark--outline` |
| `status_pending` | Pending status | Carbon `pending` |
| `status_in_progress` | In-progress status | Carbon `in-progress` |

### Billing & cost management (18)

| Icon | Purpose | Source |
|---|---|---|
| `wallet` | Wallet | Carbon `wallet` |
| `credit_card` | Payment method | Carbon `purchase` |
| `invoice` | Invoice | Carbon `receipt` |
| `receipt` | Receipt | Carbon `document--tasks` |
| `payment` | Payment | Carbon `money` |
| `currency` | Currency | Carbon `currency` |
| `cost` | Cost management | Carbon `cost` |
| `price_tag` | Pricing | Carbon `tag` |
| `calculator` | Cost calculator | Carbon `calculator` |
| `usage` | Resource usage | Carbon `chart--column` |
| `cost_analysis` | Cost analysis | Carbon `chart--waterfall` |
| `budget` | Budget | Carbon `piggy-bank` |
| `subscription` | Subscription | Carbon `renew` |
| `transaction` | Transaction | Carbon `arrows--vertical` |
| `refund` | Refund | Carbon `undo` |
| `tax` | Tax | Carbon `percentage` |
| `revenue` | Revenue | Carbon `chart--line--data` |
| `shopping_cart` | Shopping cart | Carbon `shopping--cart` |

### Cloud operations & automation (20)

| Icon | Purpose | Source |
|---|---|---|
| `automation` | Automation | Carbon `automatic` |
| `workflow` | Workflow | Carbon `workflow-automation` |
| `scheduler` | Scheduler | Carbon `event--schedule` |
| `migration` | Migration | Carbon `migrate` |
| `provisioning` | Provisioning | Carbon `rocket` |
| `maintenance` | Maintenance | Carbon `tool-box` |
| `update` | Update | Carbon `update-now` |
| `upgrade` | Upgrade | Carbon `upgrade` |
| `rollback` | Rollback | Carbon `rotate--counterclockwise--alt` |
| `sync` | Synchronization | Carbon `sync-settings` |
| `activity_history` | Activity history | Carbon `task--view` |
| `task` | Task management | Carbon `task` |
| `job` | Background job | Carbon `batch-job` |
| `api` | API management | Carbon `api` |
| `webhook` | Webhook | Carbon `webhook` |
| `pipeline` | Pipeline | Carbon `pipelines` |
| `code` | Code | Carbon `code` |
| `catalog` | Service catalog | Carbon `catalog` |
| `policy` | Policy | Carbon `policy` |
| `message_queue` | Message queue | Carbon `message-queue` |

### Common UI (16)

| Icon | Purpose | Source |
|---|---|---|
| `sidebar` | Sidebar | Carbon `side-panel--open` |
| `arrow_left` | Arrow left | Carbon `arrow--left` |
| `arrow_right` | Arrow right | Carbon `arrow--right` |
| `remove` | Remove | Carbon `subtract` |
| `more_horizontal` | More (horizontal) | Carbon `overflow-menu--horizontal` |
| `message` | Message | Carbon `chat` |
| `help` | Help | Carbon `help` |
| `grid` | Grid layout | Carbon `grid` |
| `list` | List layout | Carbon `list` |
| `table` | Table layout | Carbon `table` |
| `maximize` | Maximize | Carbon `maximize` |
| `minimize` | Minimize | Carbon `minimize` |
| `history` | History | Carbon `recently-viewed` |
| `sort_ascending` | Sort ascending | Carbon `sort--ascending` |
| `sort_descending` | Sort descending | Carbon `sort--descending` |
| `filter_list` | Filter list | Carbon `filter--edit` |

## Validation

- `icons.spec.ts`: legacy names preserved, no duplicate names across sets, snake_case, valid viewBox, safe/parsable SVG
  (no script/style/class/xmlns), all new icons 32x32.
- Visual check: every new icon rendered on light (#fff) and dark (#161616) backgrounds with `currentColor`.
- Bundle (`fesm2022/assistanz-carbideui.mjs`): 1,518,192 -> 1,605,197 bytes raw (+87.0 KB), 217,219 -> 245,257 gzip (+28.0 KB).

## Not done / follow-ups

- P2 "advanced cloud services" (~30 icons) from the proposal are not included.
- `ICONS` is one object, so importing `NgccIcon` still bundles every icon; making the registry lazy would change the
  public API and was left out of scope.
- Kebab-case aliases are not provided (spec said snake_case).

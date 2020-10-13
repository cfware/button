import ShadowElement, {html, template, define, stringProperties} from '@cfware/shadow-element';
import {immediateBlockEvent} from '@cfware/event-blocker';

import '@cfware-app/icon';

function renderLink(current, href, download) {
	if (download) {
		return html`
			<a hidden ref=${current} href=${href} download=${download}>a</a>
		`;
	}

	if (href) {
		return html`
			<a hidden ref=${current} href=${href}>a</a>
		`;
	}
}

class CFWareButton extends ShadowElement {
	_link = {};

	_setTabIndex() {
		if (this.noTab) {
			this.setAttribute('tabindex', -1);
		} else if (this.disabled) {
			this.removeAttribute('tabindex');
		} else {
			this.setAttribute('tabindex', 0);
		}
	}

	get noTab() {
		return this.hasAttribute('no-tab');
	}

	set noTab(value) {
		if (this.noTab === Boolean(value)) {
			return;
		}

		this.toggleAttribute('no-tab');
		this._setTabIndex();
	}

	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(value) {
		if (this.disabled === Boolean(value)) {
			return;
		}

		this.toggleAttribute('disabled');
		this._setTabIndex();
	}

	constructor() {
		super();

		const clickKeys = new Set(['Enter', ' ']);
		this.addEventListener('keypress', event => {
			if (clickKeys.has(event.key)) {
				this.click();
			}
		});

		this.addEventListener('click', event => {
			if (this.disabled) {
				immediateBlockEvent(event);
			}
		}, {capture: true});

		this.addEventListener('click', event => {
			if (event.composedPath()[0] !== this._link.current) {
				this._link.current?.click();
			}
		});

		this.setAttribute('role', 'button');
		this._setTabIndex();
	}

	get [template]() {
		const downloadLink = renderLink(this._link, this.href, this.download);

		return html`
			<style>
				:host {
					display: inline-block;
					position: relative;
					background: var(--background, inherit);
					color: var(--color, #000c);
					cursor: pointer;
					outline: 0;
					padding: .5em 0;
					width: 2em;
					text-align: center;
					line-height: 1;
				}

				:host([spacer]) {
					visibility: hidden;
				}

				:host([disabled]), :host([disabled]) * {
					cursor: default;
				}

				:host(:not([disabled]):hover) {
					background: var(--hover-background, inherit);
					color: var(--hover-color, #005d90);
				}

				:host(:not([disabled]):focus) {
					background: var(--focus-background, #bbf4);
					color: var(--focus-color, inherit);
				}

				:host([disabled]) cfware-icon {
					opacity: 0.25;
				}

				cfware-icon {
					cursor: pointer;
				}
			</style>
			${downloadLink}
			<cfware-icon icon=${this.icon} />
		`;
	}
}

CFWareButton[define]('cfware-button', {
	[stringProperties]: {
		icon: '',
		href: '',
		download: ''
	}
});

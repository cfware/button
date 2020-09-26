import ShadowElement, {html, template, define, stringProperties} from '@cfware/shadow-element';
import {immediateBlockEvent} from '@cfware/event-blocker';

import '@cfware/icons';

class CFWareButton extends ShadowElement {
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
		});
		this.setAttribute('role', 'button');
		this._setTabIndex();
	}

	get [template]() {
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

				:host([disabled]) cfware-icons {
					opacity: 0.25;
				}

				cfware-icons {
					cursor: pointer;
				}
			</style>
			<cfware-icons>${this.icon}</cfware-icons>
		`;
	}
}

CFWareButton[define]('cfware-button', {
	[stringProperties]: {
		icon: ''
	}
});

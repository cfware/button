import ShadowElement, {html, template, define, reflectBooleanProperties, reflectStringProperties} from '@cfware/shadow-element';
import {immediateBlockEvent} from '@cfware/event-blocker';

import '@cfware-app/icon';

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

		this.setAttribute('role', 'button');
		this._setTabIndex();
	}

	get [template]() {
		this._setTabIndex();
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
			<cfware-icon icon=${this.icon} />
		`;
	}
}

reflectBooleanProperties(CFWareButton, ['disabled', 'noTab']);
reflectStringProperties(CFWareButton, {icon: ''});
CFWareButton[define]('cfware-button');

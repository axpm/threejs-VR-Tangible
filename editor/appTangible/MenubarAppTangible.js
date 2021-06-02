// import { UIPanel, UIRow } from './libs/ui.js';

import {UIPanel, UIRow } from '../js/libs/ui.js'

import { receptorBLE } from './receptorBLE.js'
import { gestorFiguras } from './gestorFiguras.js'

function MenubarAppTangible( editor ) {

	var strings = editor.strings;

	var container = new UIPanel();
	container.setClass( 'menu' );

	var title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/appTangible' ) );
	container.add( title );

	var options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );

	// Source code

	var option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/appTangible/connect' ) );
	option.onClick( function () {
		receptorBLE.connect()

		gestorFiguras.initGestor()
	} );
	options.add( option );

	// About

	var option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/appTangible/disconnect' ) );
	option.onClick( function () {
		receptorBLE.disconnect()
	} );
	options.add( option );

	return container;

}

export { MenubarAppTangible };

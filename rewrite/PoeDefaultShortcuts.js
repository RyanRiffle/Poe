(function PoeDefaultShortcuts(Poe) {
'use strict';

if (!Poe.ShortcutManager || !Poe.Keysym) {
	throw new Error('PoeDefaultShortcuts.js requires ShortcutManager.js and Keysym.js to be loaded first.');
}

function Action_ToggleBold() {
	var textStyle = Poe.TextFormat.TextStyle.getStyle();
	textStyle.setBold(!textStyle.isBold());
	textStyle.applyStyle();
	app.doc.caret.emit('moved');
	event.preventDefault();
}

function Action_ToggleItalic() {
	var textStyle = Poe.TextFormat.TextStyle.getStyle();
	textStyle.setItalic(!textStyle.isItalic());
	textStyle.applyStyle();
	app.doc.caret.emit('moved');
	event.preventDefault();
}

function Action_ToggleUnderline() {
	var textStyle = Poe.TextFormat.TextStyle.getStyle();
	textStyle.setUnderline(!textStyle.isUnderline());
	textStyle.applyStyle();
	app.doc.caret.emit('moved');
	event.preventDefault();
}

function Action_ToggleStrikeThrough() {
	/*
		TODO: Implement Strike-Through
	*/
}

function Action_MoveToEndOfLine() {
	self._caret.moveToEndOfLine();
}

function Action_MoveToStartOfLine() {
	self._caret.moveToStartOfLine();
}

function Action_MoveCaretDownLine() {
	self._caret.moveEnd();
}

function Action_MoveCaretUpLine() {
	self._caret.moveBeginning();
}

function Action_NewDocument() {
	if (app.doc.hasChanged()) {
		//Show 'save work?' dialog
		console.log('Document has changed!');
	}

	app.doc.remove();
	var d = new Poe.Document();
	app.setDocument(d);
}

function Action_Save() {
	var pml = new Poe.FileFormat.Pml();
	if (app.doc.getFilePath() !== null) {
		//The file already has a save location
		pml.saveFile(app.doc.getFilePath(), app.doc);
		return;
	}

	pml.save(app.doc);
}

function Action_SaveAs() {
	var pml = new Poe.FileFormat.Pml();
	pml.save(app.doc);
}

function Action_Open() {
	/*
		TODO: Implement dialog boxes. Then show a prompt
		asking if they would like to save their work first
	*/
	if (app.doc.hasChanged()) {
		//Show that dialog
		console.log('Document has changed!');
	}

	var p = new Poe.FileFormat.Pml();
	p.open();
}

Poe.ShortcutManager.addShortcut({
	alias: 'bold',
	modifiers: 'meta',
	keyCode: Poe.Keysym.B,
	description: 'Make selection or input bold',
	callback: Action_ToggleBold
});

Poe.ShortcutManager.addShortcut({
	alias: 'italic',
	modifiers: 'meta',
	keyCode: Poe.Keysym.I,
	description: 'Make selection or input italic',
	callback: Action_ToggleItalic
});

Poe.ShortcutManager.addShortcut({
	alias: 'underline',
	modifiers: 'meta',
	keyCode: Poe.Keysym.U,
	description: 'Make selection or input underlined',
	callback: Action_ToggleUnderline
});

Poe.ShortcutManager.addShortcut({
	alias: 'strike_through',
	modifiers: 'meta',
	keyCode: Poe.Keysym.Dash,
	description: 'Make selection or input striked out',
	callback: Action_ToggleStrikeThrough
});

Poe.ShortcutManager.addShortcut({
	alias: 'moveToEndOfLine',
	modifiers: 'meta',
	keyCode: Poe.Keysym.Right,
	description: 'Move caret to the end of the line',
	callback: Action_MoveToEndOfLine
});

Poe.ShortcutManager.addShortcut({
	alias: 'moveToStartOfLine',
	modifiers: 'meta',
	keyCode: Poe.Keysym.Left,
	description: 'Move caret to the start of the line',
	callback: Action_MoveToStartOfLine
});

Poe.ShortcutManager.addShortcut({
	alias: 'moveCaretDownLine',
	modifiers: 'meta',
	keyCode: Poe.Keysym.Down,
	description: 'Move caret down one line',
	callback: Action_MoveCaretDownLine
});

Poe.ShortcutManager.addShortcut({
	alias: 'moveCaretUpLine',
	modifiers: 'meta',
	keyCode: Poe.Keysym.Up,
	description: 'Move caret up one line',
	callback: Action_MoveCaretUpLine
});

Poe.ShortcutManager.addShortcut({
	alias: 'new_document',
	modifiers: 'meta',
	keyCode: Poe.Keysym.N,
	description: 'Start a new document',
	callback: Action_NewDocument
});

Poe.ShortcutManager.addShortcut({
	alias: 'save',
	modifiers: 'meta',
	keyCode: Poe.Keysym.S,
	description: 'Save document',
	callback: Action_Save
});

Poe.ShortcutManager.addShortcut({
	alias: 'save_as',
	modifiers: 'meta+shift',
	keyCode: Poe.Keysym.S,
	description: 'Save document to another location',
	callback: Action_SaveAs
});

Poe.ShortcutManager.addShortcut({
	alias: 'open',
	modifiers: 'meta',
	keyCode: Poe.Keysym.O,
	description: 'Open document...',
	callback: Action_Open
});

})(window.Poe);

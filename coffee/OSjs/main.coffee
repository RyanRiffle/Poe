###
    Poe.GUI.Editor a wrapper around Poe.Document in order for the program to be usable by
    a window.
###
window.Poe = window.Poe || {}
Poe.OSjs = yes

Application = OSjs.Helpers.DefaultApplication
Window = OSjs.Helpers.DefaultApplicationWindow

ApplicationPoeWindow = (app, metadata) ->
    Window.apply(this, ['ApplicationPoeWindow',
        icon: metadata.icon
        title: metadata.name
        allow_drop: false
        width: 800
        height: 450
        , app])

ApplicationPoeWindow.prototype = Object.create(Window.prototype)

ApplicationPoeWindow.prototype.init = (vmRef, app) ->
    root = Window.prototype.init.apply(this, arguments)
    @Poe = new Poe.Writer(root)

    toolbar = this._addGUIElement(new OSjs.GUI.ToolBar('PoeToolBar'), root);

    _createIcon = (i) ->
        return OSjs.API.getThemeResource(i, 'icon')

    toolbar.addItem 'bold',
        toggleable: true
        onClick: @Poe.toolbarHelper.btnBoldClicked
        icon: _createIcon 'actions/format-text-bold.png'

    toolbar.addItem 'italic',
        toggleable: true
        onClick: @Poe.toolbarHelper.btnItalicClicked
        icon: _createIcon 'actions/format-text-italic.png'
    toolbar.addItem 'underline',
        toggleable: true
        onClick: @Poe.toolbarHelper.btnUnderlineClicked
        icon: _createIcon 'actions/format-text-underline.png'
    toolbar.addSeparator()
    toolbar.addItem 'alignLeft',
        toggleable: true
        onClick: @Poe.toolbarHelper.btnAlignLeftClicked
        icon: _createIcon 'actions/format-justify-left.png'
    toolbar.addItem 'alignCenter',
        toggleable: true
        onClick: @Poe.toolbarHelper.btnAlignCenterClicked
        icon: _createIcon 'actions/format-justify-center.png'
    toolbar.addItem 'alignRight',
        toggleable: true
        onClick: @Poe.toolbarHelper.btnAlignRightClicked
        icon: _createIcon 'actions/format-justify-right.png'

    toolbar.render();

    console.log toolbar
    onResize = () =>
        wrapper = @Poe.element.parents('.WindowWrapper')
        #@Poe.element.width(wrapper.width())
        @Poe.element.height(wrapper.height() - $(toolbar.$container).height())
        @Poe.document.textCursor.show()

        # The cursor has to have the same z-index + 1 as the window since it is
        # absolute
        $('.visiblecursor').css('z-index', "#{@_getZindex()+1}");
    ###
    These are some OSjs specific things. It has to do with
    ###
    @_addHook 'resize', onResize
    @_addHook 'maximize', onResize
    @_addHook 'restore', onResize
    @_addHook 'minimize', @Poe.document.textCursor.hide()
    @_addHook 'restore', @Poe.document.textCursor.show()

    onResize()
    return root

ApplicationPoe = (args, metadata) ->
    Application.apply(this, ['ApplicationPoe', args, metadata])

ApplicationPoe.prototype = Object.create(Application.prototype)
ApplicationPoe.prototype.init = (settings, metadata) ->
    @mainWindow = @_addWindow(new ApplicationPoeWindow(this, metadata))
    Application.prototype.init.apply(this, arguments)

OSjs.Applications.ApplicationPoe = ApplicationPoe

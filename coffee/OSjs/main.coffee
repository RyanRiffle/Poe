###
    Poe.GUI.Editor a wrapper around Poe.Document in order for the program to be usable by
    a window.
###
window.Poe = window.Poe || {}
Poe.OSjs = {}

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

    toolbar = @_addGUIElement(new Poe.OSjs.Toolbar(@Poe, this, 'PoeToolbar'), root)

    onResize = () =>
        wrapper = @Poe.element.parents('.WindowWrapper')
        #@Poe.element.width(wrapper.width())
        heights = 0
        console.log @Poe.element.parent().children()
        for elm in @Poe.element.parent().children()
            if (elm == @Poe.element[0])
                continue
            heights += $(elm).outerHeight()
        @Poe.element.css('height', (wrapper.height() - heights)+'px')
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

    @_addHook 'blur', @Poe.document.textCursor.hide()
    @_addHook 'focus', @Poe.document.textCursor.show()

    @Poe.element.before $(toolbar.$container.parentElement)

    onResize()
    return root

ApplicationPoe = (args, metadata) ->
    Application.apply(this, ['ApplicationPoe', args, metadata])

ApplicationPoe.prototype = Object.create(Application.prototype)
ApplicationPoe.prototype.init = (settings, metadata) ->
    @mainWindow = @_addWindow(new ApplicationPoeWindow(this, metadata))
    Application.prototype.init.apply(this, arguments)

OSjs.Applications.ApplicationPoe = ApplicationPoe

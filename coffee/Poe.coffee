window.Poe = {}

$(document).ready ->
  writer = new Poe.Writer('#Poe')

if !Array.prototype.last
  Array.prototype.last = ->
    return this[this.length - 1]

if !Array.prototype.first
  Array.prototype.first =  ->
    return this[0]

if !Array.prototype.insertBefore
  Array.prototype.insertBefore = (insert, before) ->
    index = this.indexOf before
    if index != -1
      this.splice index, 0, insert
      return true

    return false

if !Array.prototype.insertAfter
  Array.prototype.insertAfter = (insert, after) ->
    index = this.indexOf after
    if index != -1
      this.append insert if index == this.length
      this.splice index+1, 0, insert
      return true

    return false

if !Array.prototype.append
  Array.prototype.append = (item) ->
    this[this.length] = item
    return this

if !Array.prototype.prepend
  Array.prototype.prepend = (item) ->
    this.splice 0, 0, item
    return this

if !Array.prototype.next
  Array.prototype.next = (after) ->
    index = @indexOf after
    return this[index+1] if @length - 1 >= index+1
    return null

if !Array.prototype.prev
  Array.prototype.prev = (before) ->
    index = @indexOf before
    return this[index-1] if @length > 0
    return null

if !Array.prototype.remove
  Array.prototype.remove = (item) ->
    index = @indexOf item
    @splice index, 1

if !Array.prototype.last
  Array.prototype.last = ->
    if @length > 0
      return this[@length - 1]
    return null

if !Array.prototype.first
  Array.prototype.first = ->
    if @length > 0
      return this[0]
    return null

if !Array.prototype.contains
  Array.prototype.contains = (item) ->
    return @indexOf(item) != -1

# @nodoc
$.fn.prevSibling = ->
  sibling = $ this[0].previousSibling
  return sibling if sibling.length != 0
  return null

# @nodoc
$.fn.nextSibling = ->
  sibling = $ this[0].nextSibling
  return sibling if sibling.length != 0
  return null

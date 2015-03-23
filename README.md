# Space.js
A JavaScript library for depth-scrolling.

Demo and article [Codrops link(soon)](#)

## Usage

**Import the library**
```html
<head>
	<script type="text/javascript" src="[jquery]"></script>
	...
</head>
<body>
	[Your contents]
	<script type="text/javascript" src="space.min.js"></script>
</body>
```


**Construct your frames**

```html
<div class="space-frame">
	<div class="space-inner-frame">
		[First page]
	</div>
</div>
<div class="space-frame">
	<div class="space-inner-frame">
		[Second page]
	</div>
</div>
...etc
```

### Options
You may extend the time that a frame is visible throught the data-duration attribute.
```html
<div class="space-frame" data-duration="1.4">
```
Override the default transition

```html
<div class="space-frame" data-transition="slideInBottom fadeOut">
```
Specify specifik entry and exit transitions. (Also overrides the default transition.)

```html
<div class="space-frame" data-enter="slideInBottom" data-exit="slideOutDown fadeOut">
```


### Supported transitions
- scaleIn
- fadeIn
- scaleOut
- fadeOut
- rotateQuarterRight
- slideInBottom
- slideOutDown
- slideOutLeft
- slideOutRight
- slideOutUp
- slideBottomRight


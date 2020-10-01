# Space.js

A HTML-driven JavaScript-library for narrative 3D-scrolling.

See the demos [here](http://www.slashie.org/space.js/)

**NOTE THAT SHOULD BE CONSIDERED TO BE BETA SOFTWARE**
*Production use is not recommended at this point.*

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

The library is HTML-driven, which means that you don't need to write a single line of JavaScript to use it on your site and still have a lot of flexibility!

The core of the library is to divide our HTML into frames, or *space-frames* as we call them her (to not conflict the common class name "frame").


### Creating a frame
```html
<div class="space-frame">[contents]</div>
```

I would also **strongly** recommend using an inner-frame inside the space-frame, which provides some helpful CSS to make things centered both vertically and horizontally inside the frame.

```html
<div class="space-frame">
	<section class="space-inner-frame">
		[contents]
	</section>
</div>
```

### Custom duration
If we want we can provide a custom duration for our frames with the data-duration attribute, which multiplies the default duration of the transition.

```html
<section class="space-frame" data-duration="1.4">...</section>
<section class="space-frame" data-duration="0.6">...</section>
```


### Options
Space.js has a default default transition - which is to enter by fading in and exit by scaling up and fading out. We can also provide a custom transition override to the library from predefined transitions. (We can also create our own transitions from scratch, but we'll get to that later.)

```html
<section class="space-frame" data-transition="rotate360">...</section>
```

Multiple values are supported!

```html
<section class="space-frame" data-transition="rotate360 fadeOut slideInLeft">...</section>
```

### Custom entry and exit
If we really want to get into detail, we can provide how we wish the frame to enter (first half of the frame duration) and exit (second half).

```html
<section class="space-frame" data-enter="fadeIn" data-exit="fadeOut zoomOut">...</section>
```

## What a complete frame could look like
```html
<div class="space-frame" data-enter="fadeIn" data-exit="zoomOut fadeOut" data-duration="1.3">
	<section class="space-inner-frame">
		<div style="background-image:url(img/splash.png); padding:150px 200px;" class="bg">
			<section>
				<p>Demo 1</p>
				<h1>The Gallery</h1>
			</section>
		</div>
	</section>
</div>
```

## Custom transitions
You can add your own transitions with the ```addTransitions`` method. Make sure it is done after the library is loaded.

```javascript
<script src="space.js"></script>

<script type="text/javascript">
	var transitions = {
		rotate720: {
			'rotate':{from:0, to:720}
		},
		fadeOutHalf: {
			'opacity':{from:1, to:0.5}
		}
	};
	Space.addTransitions(transitions);
</script>
```

### Currently supported transitions
Note that these might come to change during the beta-phase of the library.

1. scaleIn
2. fadeIn
3. scaleOut
4. fadeOut
5. rotateQuarterRight
6. rotateInQuarterClockwise
7. zoomOut
8. slideInBottom
9. slideOutDown
10. slideOutLeft
11. slideOutRight
12. slideInRight
13. slideOutUp
14. slideInTop
15. slideInLeft
16. slideBottomRight
17. rotate360
18. rotate3dOut


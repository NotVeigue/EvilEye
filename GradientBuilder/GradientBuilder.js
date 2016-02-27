function Gradient()
{
	var o = {};

	o.colors = [];

	// Returns an rgb color object or hex value of the color at position t along the gradient.
	o.GetColorAt = function(t, hex)
	{
		if(o.colors.lenght === 0)
			return null;

		var length = o.colors.length;

		if(length === 1)
			return hex ? o.colors[0].color.ToHex() : o.colors[0].color;

		t = Math.min(Math.max(0, t), 1);

		if(t <= o.colors[0].step)
			return hex ? o.colors[0].color.ToHex() : o.colors[0].color;

		if(t >= o.colors[length - 1].step)
			return hex ? o.colors[length - 1].color.ToHex() : o.colors[length - 1].color;

		var i = length - 1;
		while(o.colors[i].step > t)
			--i;
		
		var start = o.colors[i].color;
		var end = o.colors[i + 1].color;
		var diff = o.colors[i + 1].step - o.colors[i].step;
		t = (t - o.colors[i].step) / diff;

		return interpolate(start.r, start.g, start.b, start.a, end.r, end.g, end.b, end.a, t, !hex);
	};

	// ------------------------------------------------------------------------------------------------------------
	// step (Number) : A value between 0 and 1 representing where in the gradient the color occurs
	// color (Object): An object containing 3 values -- r, g, and b -- between 0 and 255, representing the red, green, and blue values of the color
	// id (String)	 : A unique string by which to identify the color. Used for easy removal from the array.
	// ------------------------------------------------------------------------------------------------------------	
	o.AddColorStep = function(step, color, id)
	{
		o.colors.push({
			step: step,
			color: color,
			id: id
		});

		o.colors.sort(compareColors);
	};

	o.RemoveColorStep = function(id)
	{
		// Trying this new silly loop structure for the heck of it.
		var i = o.colors.length;
		while(--i)
		{
			if(o.colors[i].id === id)
			{
				o.colors.splice(i, 1);
				return;
			}
		}
	};

	function compareColors(a, b)
	{
		return a.step > b.step ? 1 : -1;
	};

	return o;
};

function Color(r, g, b, a)
{
	var o = {};
	o.r = r;
	o.g = g;
	o.b = b;
	o.a = a || 255;
	o.ToHex = function(){return RGB2Color(o.r, o.g, o.b);};

	return o;
}

function interpolate(r1, g1, b1, a1, r2, g2, b2, a2, t, rgb)
{
	var r = r1 + t*(r2-r1);
	var g = g1 + t*(g2-g1);
	var b = b1 + t*(b2-b1);
	var a = a1 + t*(a2-a1);

	return rgb ? Color(r, g, b, a) : RGB2Color(r,g,b);
};

function RGB2Color(r,g,b)
{
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
};

function byte2Hex(n)
{
	var nybHexString = "0123456789ABCDEF";
	return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
};
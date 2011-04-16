// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Color)]
	[Tooltip("Interpolate through an array of Colors over a specified amount of Time.")]
	public class ColorInterpolate : FsmStateAction
	{
		[RequiredField]
		public FsmColor[] colors;
		[RequiredField]
		public FsmFloat time;
		[RequiredField]
		[UIHint(UIHint.Variable)]
		public FsmColor storeColor;
		public FsmEvent finishEvent;
		[Tooltip("Ignore TimeScale")]
		public bool realTime;

		private float startTime;
		private float currentTime;
		
		public override void Reset()
		{
			colors = new FsmColor[3];
			time = 1.0f;
			storeColor = null;
			finishEvent = null;
			realTime = false;
		}

		public override void OnEnter()
		{
			startTime = Time.realtimeSinceStartup;
			currentTime = 0f;

			if (storeColor == null || colors.Length < 2)
			{
				if (colors.Length == 1)
					storeColor.Value = colors[0].Value;
				Finish();
			}
			else
			{
				storeColor.Value = colors[0].Value;
			}
		}
		
		public override void OnUpdate()
		{
			// update time
			
			if (realTime)
			{
				currentTime = Time.realtimeSinceStartup - startTime;
			}
			else
			{
				currentTime += Time.deltaTime;
			}
			
			// finished?
			
			if (currentTime > time.Value)
			{
				storeColor.Value = colors[colors.Length-1].Value;
				
				if (finishEvent != null)
					Fsm.Event(finishEvent);

				Finish();
				return;
			}
			
			// lerp
			
			Color lerpColor;
			float lerpAmount = (colors.Length-1) * currentTime/time.Value;

			if (lerpAmount == 0)
				lerpColor = colors[0].Value;
			else if (lerpAmount == colors.Length-1)
				lerpColor = colors[colors.Length-1].Value;
			else
			{
				Color color1 = colors[Mathf.FloorToInt(lerpAmount)].Value;
				Color color2 = colors[Mathf.CeilToInt(lerpAmount)].Value;
				lerpAmount -= Mathf.Floor(lerpAmount);
				
				lerpColor = Color.Lerp(color1, color2, lerpAmount);
			}
			
			storeColor.Value = lerpColor;
		}
		
		public override string ErrorCheck ()
		{
			if(colors.Length < 2)
				return "Define at least 2 colors to make a gradient.";
			return null;
		}
	}
}
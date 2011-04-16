// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Color)]
	[Tooltip("Get the RGBA channels of a Color Variable and store them in Float Variables.")]
	public class GetColorRGBA : FsmStateAction
	{
		[RequiredField]
		[UIHint(UIHint.Variable)]
		public FsmColor color;
		[UIHint(UIHint.Variable)]
		public FsmFloat storeRed;		
		[UIHint(UIHint.Variable)]
		public FsmFloat storeGreen;		
		[UIHint(UIHint.Variable)]
		public FsmFloat storeBlue;		
		[UIHint(UIHint.Variable)]
		public FsmFloat storeAlpha;
		public bool everyFrame;
		
		public override void Reset()
		{
			color = null;
			storeRed = null;
			storeGreen = null;
			storeBlue = null;
			storeAlpha = null;
			everyFrame = false;
		}

		public override void OnEnter()
		{
			DoGetColorRGBA();
			
			if (!everyFrame)
				Finish();
		}
		
		public override void OnUpdate ()
		{
			DoGetColorRGBA();
		}
		
		void DoGetColorRGBA()
		{
			if (color == null) return;
			
			if (storeRed != null)
				storeRed.Value = color.Value.r;

			if (storeGreen != null)
				storeGreen.Value = color.Value.g;

			if (storeBlue != null)
				storeBlue.Value = color.Value.b;

			if (storeAlpha != null)
				storeAlpha.Value = color.Value.a;
		}
	}
}
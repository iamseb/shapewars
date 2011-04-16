// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;
using System.Collections.Generic;

namespace HutongGames.PlayMaker.Actions
{
	// base type for GUI actions that need a Rect
	[Tooltip("GUI base action - don't use!")]
	public class GUIAction : FsmStateAction
	{
		[RequiredField]
		public FsmFloat left;
		[RequiredField]
		public FsmFloat top;
		[RequiredField]
		public FsmFloat width;
		[RequiredField]
		public FsmFloat height;
		[RequiredField]
		public FsmBool normalized;
		
		internal Rect rect;
		
		public override void Reset()
		{
			left = 0;
			top = 0;
			width = 1;
			height = 1;
			normalized = true;
		}
		
		public override void OnGUI()
		{
			rect = new Rect(left.Value, top.Value, width.Value, height.Value);
			
			if (normalized.Value)
			{
				rect.x *= Screen.width;
				rect.width *= Screen.width;
				rect.y *= Screen.height;
				rect.height *= Screen.height;
			}
		}
	}
}
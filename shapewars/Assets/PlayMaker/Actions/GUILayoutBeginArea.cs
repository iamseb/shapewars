// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;
using System.Collections.Generic;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.GUILayout)]
	[Tooltip("Begin a GUILayout block of GUI controls in a fixed screen area. NOTE: Block must end with a corresponding GUILayoutEndArea.")]
	public class GUILayoutBeginArea : FsmStateAction
	{
		[RequiredField]
		public FsmFloat left;
		[RequiredField]
		public FsmFloat top;
		[RequiredField]
		public FsmFloat width;
		[RequiredField]
		public FsmFloat height;
		public FsmBool normalized;
		public FsmString style;
		
		public override void Reset()
		{
			left = 0f;
			top = 0f;
			width = 1f;
			height = 1f;
			normalized = true;
			style = "";
		}

		public override void OnGUI()
		{
			Rect rect = new Rect(left.Value, top.Value, width.Value, height.Value);
			
			if (normalized.Value)
			{
				rect.x *= Screen.width;
				rect.width *= Screen.width;
				rect.y *= Screen.height;
				rect.height *= Screen.height;
			}
			
			GUILayout.BeginArea(rect, style.Value);
		}
	}
}
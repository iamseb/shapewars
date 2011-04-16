// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.GUI)]
	[Tooltip("Draws a GUI Texture.")]
	public class DrawTexture : FsmStateAction
	{
		[RequiredField]
		public Texture texture;
		[RequiredField]
		public FsmFloat left;
		[RequiredField]
		public FsmFloat top;
		[RequiredField]
		public FsmFloat width;
		[RequiredField]
		public FsmFloat height;
		public ScaleMode scaleMode;
		public FsmBool alphaBlend;
		public FsmFloat imageAspect;
		[Tooltip("Use normalized screen coordinates (0-1)")]
		public bool normalized;

		public override void Reset()
		{
			texture = null;
			left = 0;
			top = 0;
			width = 1;
			height = 1;
			scaleMode = ScaleMode.StretchToFill;
			alphaBlend = true;
			imageAspect = 0;
			normalized = true;
		}

		public override void OnGUI()
		{
			if (texture == null) return;
			
			Rect rect = new Rect(left.Value, top.Value, width.Value, height.Value);
			
			if (normalized)
			{
				rect.x *= Screen.width;
				rect.width *= Screen.width;
				rect.y *= Screen.height;
				rect.height += Screen.height;
			}
			
			GUI.DrawTexture(rect, texture, scaleMode, alphaBlend.Value, imageAspect.Value);
		}
	}
}
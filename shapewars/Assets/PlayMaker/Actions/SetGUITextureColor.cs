// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.GUIElement)]
	[Tooltip("Sets the Color of the GUITexture attached to a Game Object.")]
	public class SetGUITextureColor : FsmStateAction
	{
		[RequiredField]
		[CheckForComponent(typeof(GUITexture))]
		public FsmOwnerDefault gameObject;
		[RequiredField]
		public FsmColor color;
		
		public override void Reset()
		{
			gameObject = null;
			color = Color.white;
		}

		public override void OnEnter()
		{
			GameObject go = Fsm.GetOwnerDefaultTarget(gameObject);
			if (go != null && go.guiTexture != null)
				go.guiTexture.color = color.Value;
			
			Finish();
		}
	}
}
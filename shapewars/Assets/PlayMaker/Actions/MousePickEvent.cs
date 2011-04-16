// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Input)]
	[Tooltip("Sends Events based on mouse interactions with a Game Object: MouseOver, MouseDown, MouseUp, MouseOff. Use Ray Distance to set how close the camera must be to pick the object.")]
	public class MousePickEvent : FsmStateAction
	{
		[CheckForComponent(typeof(Collider))]
		public FsmOwnerDefault GameObject;
		public FsmFloat rayDistance = 100f;
		public FsmEvent mouseOver;
		public FsmEvent mouseDown;
		public FsmEvent mouseUp;
		public FsmEvent mouseOff;
		[Tooltip("Pick only from these layers.")]
		[UIHint(UIHint.Layer)]
		public FsmInt[] layerMask;
		[Tooltip("Invert the mask, so you pick from all layers except those defined above.")]
		public FsmBool invertMask;
		
		public override void Reset()
		{
			GameObject = null;
			rayDistance = 100f;
			mouseOver = null;
			mouseDown = null;
			mouseUp = null;
			mouseOff = null;
			layerMask = new FsmInt[0];
			invertMask = false;		
		}
		
		public override void OnEnter()
		{
			DoMousePickEvent();
		}
		
		public override void OnUpdate()
		{
			DoMousePickEvent();
		}

		void DoMousePickEvent()
		{
			bool isMouseOver = DoRaycast();
			
			if (isMouseOver)
			{
				if (mouseDown != null && Input.GetMouseButtonDown(0))
					Fsm.Event(mouseDown);

				if (mouseOver != null)
					Fsm.Event(mouseOver);

				if (mouseUp != null &&Input.GetMouseButtonUp(0))
					Fsm.Event(mouseUp);
			}
			else
			{
				if (mouseOff != null)
					Fsm.Event(mouseOff);
			}
		}

		bool DoRaycast()
		{
			GameObject testObject = GameObject.OwnerOption == OwnerDefaultOption.UseOwner ? Owner : GameObject.GameObject.Value;
			
			return ActionHelpers.IsMouseOver(testObject, rayDistance.Value, ActionHelpers.LayerArrayToLayerMask(layerMask, invertMask.Value));
		}

		public override string ErrorCheck()
		{
			string errorString = "";

			errorString += ActionHelpers.CheckRayDistance(rayDistance.Value);
			errorString += ActionHelpers.CheckPhysicsSetup(GameObject);

			return errorString;
		}
	}
}
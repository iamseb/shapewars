// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.StateMachine)]
	[Tooltip("Sends an Event to another Fsm after an optional delay. Specify an Fsm Name or use the first Fsm on the object.")]
	public class SendEventToFsm : FsmStateAction
	{
		[RequiredField]
		public FsmOwnerDefault gameObject;
		[UIHint(UIHint.FsmName)]
		[Tooltip("Optional name of Fsm on Game Object")]
		public FsmString fsmName;
		[RequiredField]
		[UIHint(UIHint.FsmEvent)]
		public FsmString sendEvent;
		[HasFloatSlider(0, 10)]
		public FsmFloat delay;
		bool requireReceiver;

		private GameObject go;
		private DelayedEvent delayedEvent;

		public override void Reset()
		{
			gameObject = null;
			fsmName = null;
			sendEvent = null;
			delay = null;
			requireReceiver = false;
		}

		public override void OnEnter()
		{
			go = gameObject.OwnerOption == OwnerDefaultOption.UseOwner ? Owner : gameObject.GameObject.Value;

			if (go == null)
			{
				Finish();
				return;
			}
			
			PlayMakerFSM sendToFsm = ActionHelpers.GetGameObjectFsm(go, fsmName.Value);
			
			if (sendToFsm == null)
			{
				if (requireReceiver)
					ActionHelpers.RuntimeError(this, "GameObject doesn't have FsmComponent: " + go.name + " " + fsmName.Value);

				return;
			}

			delayedEvent = new DelayedEvent(sendToFsm, sendEvent.Value, delay.Value);
			delayedEvent.Update();
		}

		public override void OnUpdate()
		{
			if (delayedEvent != null)
				delayedEvent.Update();
			
			if (delayedEvent.Finished)
				Finish();
		}
	}
}
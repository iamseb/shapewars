// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.GameObject)]
	[Tooltip("Destroys a Game Object after a Delay.\nOptionally sends an Event when the object is destroyed.")]
	public class DestroyObject : FsmStateAction
	{
		[RequiredField]
		public FsmGameObject gameObject;
		[HasFloatSlider(0, 5)]
		public FsmFloat delay;
		public FsmBool detachChildren;
		//public FsmEvent sendEvent;

		//DelayedEvent delayedEvent;

		public override void Reset()
		{
			gameObject = null;
			delay = 0;
			//sendEvent = null;
		}

		public override void OnEnter()
		{
			GameObject go = gameObject.Value;
			
			if (go != null)
			{
				if (delay.Value > 0)
					Object.Destroy(go);
				else
					Object.Destroy(go, delay.Value);
	
				if (detachChildren.Value)
					go.transform.DetachChildren();
			}
			
			Finish();
			//delayedEvent = new DelayedEvent(Fsm, sendEvent, delay.Value);
		}

		public override void OnUpdate()
		{
			//delayedEvent.Update();
		}

	}
}
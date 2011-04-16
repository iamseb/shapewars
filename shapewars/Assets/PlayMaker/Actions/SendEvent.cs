// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.StateMachine)]
	[Tooltip("Sends an Event after an optional delay. HINT: Use a Float Variable and RandomFloat action for a random delay.")]
	public class SendEvent : FsmStateAction
	{
		[RequiredField]
		public FsmEvent sendEvent;
		[HasFloatSlider(0, 10)]
		public FsmFloat delay;

		DelayedEvent delayedEvent;

		public override void Reset()
		{
			sendEvent = null;
			delay = null;
		}

		public override void OnEnter()
		{
			if (delay.Value == 0f)
			{
				Fsm.Event(sendEvent);
				Finish();
			}
			else
			{
				delayedEvent = new DelayedEvent(Fsm, sendEvent, delay.Value);
			}
		}

		public override void OnUpdate()
		{
			delayedEvent.Update();
			
			if (delayedEvent.Finished)
				Finish();
		}
	}
}
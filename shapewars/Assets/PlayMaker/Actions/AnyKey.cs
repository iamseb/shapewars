// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Input)]
	[Tooltip("Sends an Event when the user hits any Key or Mouse Button.")]
	public class AnyKey : FsmStateAction
	{
		[RequiredField]
		public FsmEvent sendEvent;

		public override void Reset()
		{
			sendEvent = null;
		}

		public override void OnUpdate()
		{
			if (Input.anyKeyDown)
				Fsm.Event(sendEvent);
		}
	}
}
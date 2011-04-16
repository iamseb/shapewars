// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Logic)]
	[Tooltip("Tests if a Game Object has a tag.")]
	public class GameObjectCompareTag : FsmStateAction
	{
		[RequiredField]
		public FsmGameObject gameObject;
		[RequiredField]
		[UIHint(UIHint.Tag)]
		public FsmString tag;
		public FsmEvent trueEvent;
		public FsmEvent falseEvent;
		[UIHint(UIHint.Variable)]
		public FsmBool storeResult;
		
		public override void Reset()
		{
			gameObject = null;
			tag = "Untagged";
			trueEvent = null;
			falseEvent = null;
			storeResult = null;
		}

		public override void OnEnter()
		{
			bool hasTag = false;
			
			if (gameObject.Value != null)
				hasTag = gameObject.Value.CompareTag(tag.Value);
			
			Fsm.Event(hasTag ? trueEvent : falseEvent);			
			
			storeResult.Value = hasTag;
				
			Finish();
		}
	}
}
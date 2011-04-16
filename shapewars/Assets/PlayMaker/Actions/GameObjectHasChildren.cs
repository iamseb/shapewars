// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Logic)]
	[Tooltip("Tests if a Game Object has children.")]
	public class GameObjectHasChildren : FsmStateAction
	{
		[RequiredField]
		public FsmOwnerDefault gameObject;
		public FsmEvent trueEvent;
		public FsmEvent falseEvent;
		[UIHint(UIHint.Variable)]
		public FsmBool storeResult;

		public override void Reset()
		{
			gameObject = null;
			trueEvent = null;
			falseEvent = null;
			storeResult = null;
		}

		public override void OnEnter()
		{
			bool hasChildren;
			
			if (gameObject.OwnerOption == OwnerDefaultOption.UseOwner)
				hasChildren = DoHasChildren(Owner);
			else
				hasChildren = DoHasChildren(gameObject.GameObject.Value);
			
			Fsm.Event(hasChildren ? trueEvent : falseEvent);
			
			if (storeResult != null)
				storeResult.Value = hasChildren;
			
			Finish();
		}

		bool DoHasChildren(GameObject go)
		{
			if (go == null) return false;

			return go.transform.childCount > 0;
		}
	}
}
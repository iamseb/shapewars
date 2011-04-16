// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.GameObject)]
	[Tooltip("Destroys a Component of an Object.")]
	public class DestroyComponent : FsmStateAction
	{
		[RequiredField]
		public FsmOwnerDefault gameObject;
		[RequiredField]
		[UIHint(UIHint.ScriptComponent)]
		public FsmString script;
				
		Component aComponent;

		public override void Reset()
		{
			aComponent = null;
			gameObject = null;
			script = null;
		}

		public override void OnEnter()
		{
			DoDestroyComponent(gameObject.OwnerOption == OwnerDefaultOption.UseOwner ? Owner : gameObject.GameObject.Value);
			
			Finish();
		}

		
		void DoDestroyComponent(GameObject go)
		{
			aComponent = go.GetComponent(script.Value);

			if (aComponent == null)
				ActionHelpers.RuntimeError(this, "There is no such component: " + script.Value);
			else 
				Object.Destroy(aComponent);
		}
	}
}
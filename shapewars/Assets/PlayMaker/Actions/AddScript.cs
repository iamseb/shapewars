// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.ScriptControl)]
	[Tooltip("Adds a Script to a Game Object.\nUse this to change the behaviour of objects on the fly. Optionally remove the Script on exiting the state.")]
	public class AddScript : FsmStateAction
	{
		[RequiredField]
		public FsmOwnerDefault gameObject;
		[RequiredField]
		[UIHint(UIHint.ScriptComponent)]
		public FsmString script;
		public FsmBool removeOnExit;

		Component addedComponent;

		public override void Reset()
		{
			gameObject = null;
			script = null;
		}

		public override void OnEnter()
		{
			DoAddComponent(gameObject.OwnerOption == OwnerDefaultOption.UseOwner ? Owner : gameObject.GameObject.Value);
			
			Finish();
		}

		public override void OnExit()
		{
			if (removeOnExit.Value)
				if (addedComponent != null)
					Object.Destroy(addedComponent);
		}

		void DoAddComponent(GameObject go)
		{
			addedComponent = go.AddComponent(script.Value);

			if (addedComponent == null)
				ActionHelpers.RuntimeError(this, "Can't add script: " + script.Value);
		}
	}
}
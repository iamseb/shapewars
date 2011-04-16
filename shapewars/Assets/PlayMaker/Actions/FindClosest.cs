// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.GameObject)]
	[Tooltip("Finds the closest object to the specified Game Object.\nOptionally filter by Tag and Visibility.")]
	public class FindClosest : FsmStateAction
	{
		[RequiredField]
		public FsmOwnerDefault gameObject;
		[RequiredField]
		[UIHint(UIHint.Tag)]
		public FsmString withTag;
		public FsmBool mustBeVisible;
		[UIHint(UIHint.Variable)]
		public FsmGameObject storeObject;
		[UIHint(UIHint.Variable)]
		public FsmFloat storeDistance;
		public bool everyFrame;

		public override void Reset()
		{
			gameObject = null;	
			withTag = "Untagged";
			mustBeVisible = false;
			storeObject = null;
		}

		public override void OnEnter()
		{
			DoFindClosest();
			
			if (!everyFrame)
				Finish();
		}
		
		public override void OnUpdate()
		{
			DoFindClosest();
		}

		void DoFindClosest()
		{
			GameObject go = gameObject.OwnerOption == OwnerDefaultOption.UseOwner ? Owner : gameObject.GameObject.Value;
			
			GameObject[] objects = GameObject.FindGameObjectsWithTag(withTag.Value);
			GameObject closestObj = null;
			var closestDist = Mathf.Infinity;

			foreach (var obj in objects)
			{
				if (mustBeVisible.Value && !ActionHelpers.IsVisible(obj))
					continue;
				
				var dist = (go.transform.position - obj.transform.position).sqrMagnitude;
				if (dist < closestDist)
				{
					closestDist = dist;
					closestObj = obj;
				}
			}

			storeObject.Value = closestObj;
			storeDistance.Value = closestDist;
		}
	}
}


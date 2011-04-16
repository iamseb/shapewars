// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using System;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Time)]
	[Tooltip("Gets system date and time info and stores it in a string variable. An optional format string gives you a lot of control over the formatting (see online docs for format syntax).")]
	public class GetSystemDateTime : FsmStateAction
	{
		[UIHint(UIHint.Variable)]
		[Tooltip("Store System DateTime as a string.")]
		public FsmString storeString;
		[Tooltip("Optional format string. E.g., MM/dd/yyyy HH:mm")]
		public FsmString format;

		public override void Reset()
		{
			storeString = null;
			format = "MM/dd/yyyy HH:mm";
		}

		public override void OnEnter()
		{
			storeString.Value = DateTime.Now.ToString(format.Value);

			Finish();
		}
	}
}

